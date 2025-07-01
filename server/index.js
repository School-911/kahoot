const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ Cập nhật origin cụ thể (thay URL bằng domain frontend của bạn)
const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://kahoot-1-2evh.onrender.com' // 🔁 domain frontend deploy trên Render
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.options('*', cors()); // ✅ Để xử lý preflight CORS

// ✅ Kết nối MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB error:'));
db.once('open', () => {
  console.log('✅ Kết nối MongoDB thành công');
});

// ✅ Model User
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  birthdate: String
});
const User = mongoose.model('User', userSchema);

// ✅ API Đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, password, birthdate } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }
    const newUser = new User({ name, email, password, birthdate });
    await newUser.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// ✅ API Đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, name: user.name });
    } else {
      res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// ✅ Khởi tạo Server & Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'], // ✅ Bắt buộc để tránh lỗi polling trên Render
  allowEIO3: true // ✅ Đảm bảo hoạt động với phiên bản client cũ nếu có
});


// ✅ Rooms lưu trong RAM
const rooms = {};

io.on('connection', (socket) => {
  console.log('🔌 Một client đã kết nối:', socket.id);

  socket.on('host-join', (pin) => {
    console.log(`🟢 Host tạo phòng với mã PIN: ${pin}`);
    socket.join(pin);
    if (!rooms[pin]) {
      rooms[pin] = {
        hostId: socket.id,
        players: [],
        questions: [],
        currentQuestion: 0,
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
    console.log('❌ Client ngắt kết nối:', socket.id);
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

// ✅ API Lưu Quiz
const Quiz = require('./models/Quiz');
app.post('/api/quizzes', async (req, res) => {
  const { title, createdBy, questions } = req.body;
  try {
    const quiz = new Quiz({ title, createdBy, questions });
    await quiz.save();
    res.json({ success: true, quizId: quiz._id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi lưu quiz' });
  }
});

// ✅ Lắng nghe cổng
server.listen(3000, () => {
  console.log('🚀 Server chạy tại http://localhost:3000');
});
