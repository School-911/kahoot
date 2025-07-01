const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://kahoot-ova0.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.options('*', cors());

// ✅ Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB error:'));
db.once('open', () => {
  console.log('✅ Đã kết nối MongoDB thành công');
});

// ✅ Mô hình User
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  birthdate: String
});
const User = mongoose.model('User', userSchema, 'users');

// ✅ API Đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, password, birthdate } = req.body;

  console.log('📩 Nhận yêu cầu đăng ký:', req.body);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('⚠️ Email đã tồn tại:', email);
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    const newUser = new User({ name, email, password, birthdate });

    await newUser.save()
      .then(() => {
        console.log('✅ Đăng ký thành công:', email);
        res.json({ success: true });
      })
      .catch(err => {
        console.error('❌ Lỗi khi lưu user:', err);
        res.status(500).json({ success: false, message: 'Lỗi khi lưu user' });
      });

  } catch (err) {
    console.error('❌ Lỗi xử lý đăng ký:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký' });
  }
});


// ✅ API Đăng nhập (không mã hóa)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email không tồn tại' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Sai mật khẩu' });
    }

    res.json({ success: true, name: user.name });

  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// ✅ Model Quiz (nếu chưa có)
const Quiz = require('./models/Quiz');

// ✅ API Lưu Quiz
app.post('/api/quizzes', async (req, res) => {
  const { title, createdBy, questions } = req.body;
  try {
    const quiz = new Quiz({ title, createdBy, questions });
    await quiz.save();
    res.json({ success: true, quizId: quiz._id });
  } catch (err) {
    console.error('❌ Lỗi lưu quiz:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lưu quiz' });
  }
});

// ✅ Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'],
  allowEIO3: true
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('🔌 Client kết nối:', socket.id);

  socket.on('host-join', (pin) => {
    console.log(`🟢 Host tạo phòng ${pin}`);
    socket.join(pin);
    if (!rooms[pin]) {
      rooms[pin] = {
        hostId: socket.id,
        players: [],
        questions: [],
        currentQuestion: 0
      };
    }
  });

  socket.on('add-questions', ({ pin, questions }) => {
    if (rooms[pin]) {
      rooms[pin].questions = questions;
      console.log(`📋 Lưu ${questions.length} câu hỏi vào phòng ${pin}`);
    }
  });

  socket.on('join-game', ({ pin, name }) => {
    const room = rooms[pin];
    if (room) {
      room.players.push({ name, score: 0, socketId: socket.id });
      socket.join(pin);
      io.to(room.hostId).emit('player-joined', name);
      socket.emit('join-success');
    } else {
      socket.emit('join-failed');
    }
  });

  socket.on('start-game', ({ pin }) => {
    const room = rooms[pin];
    if (room) {
      sendQuestion(pin);
    }
  });

  socket.on('next-question', (pin) => {
    const room = rooms[pin];
    if (room) {
      room.currentQuestion++;
      if (room.currentQuestion < room.questions.length) {
        sendQuestion(pin);
      } else {
        io.to(room.hostId).emit('game-results', room.players);
      }
    }
  });

  socket.on('answer', ({ pin, name, answerIndex }) => {
    const room = rooms[pin];
    if (!room) return;

    const currentQ = room.questions[room.currentQuestion];
    const isCorrect = currentQ.correctIndex === answerIndex;

    const player = room.players.find(p => p.name === name);
    if (player && isCorrect) {
      player.score += 1000;
    }

    const playerSocket = io.sockets.sockets.get(player.socketId);
    if (playerSocket) {
      playerSocket.emit('answer-result', { isCorrect });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client rời khỏi:', socket.id);
  });
});

function sendQuestion(pin) {
  const room = rooms[pin];
  const currentQ = room.questions[room.currentQuestion];

  io.to(room.hostId).emit('receive-question', currentQ);
  for (const player of room.players) {
    const playerSocket = io.sockets.sockets.get(player.socketId);
    if (playerSocket) {
      playerSocket.emit('receive-question', currentQ);
    }
  }
}

// ✅ Chạy server
server.listen(3000, () => {
  console.log('🚀 Server chạy tại http://localhost:3000');
});
