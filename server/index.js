// index.js
import express from 'express'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Server } from 'socket.io'

// Routes & Controllers
import authRoutes from './routes/authRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import roomRoutes from './routes/roomRoutes.js'

// Quản lý room tạm trên RAM cho Socket
import {
  roomExists,
  addPlayerToRoom,
  getRoom,
  createRoom,
  addQuestionsToRoom
} from './roomManager.js'

// Model MongoDB
import Room from './models/Room.js'
import Quiz from './models/Quiz.js'

dotenv.config()

const app = express()
const server = http.createServer(app)

const corsOptions = {
  origin: 'https://kahoot-client.onrender.com',
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

// MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected')
}).catch(err => {
  console.error('❌ MongoDB connection error:', err)
})

// REST API Routes
app.use('/api', authRoutes)
app.use('/api', quizRoutes)
app.use('/api', roomRoutes)
app.get('/', (req, res) => res.send('Kahoot backend is running!'))

// ✅ RAM lưu chỉ số câu hỏi
const roomMemory = {}

const io = new Server(server, {
  cors: corsOptions
})

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id)

  // ✅ Host tạo phòng sau khi đã lưu DB
  socket.on('host-join', async (pin) => {
    console.log(`🎮 Host tạo phòng với mã PIN ${pin}`)

    const roomInDB = await Room.findOne({ pin })

    if (!roomInDB) {
      console.log(`❌ Không tìm thấy room trong DB với pin ${pin}`)
      socket.emit('room-not-found')
      return
    }

    createRoom(pin, socket.id)
    socket.join(pin)
    console.log(`✅ Room RAM tạo thành công cho mã pin ${pin}`)
  })

  // ✅ Nhận câu hỏi từ host
  socket.on('add-questions', ({ pin, questions }) => {
    console.log(`📚 Nhận câu hỏi cho phòng ${pin}`)
    addQuestionsToRoom(pin, questions)
  })

  // ✅ Người chơi tham gia
  socket.on('join-game', ({ pin, name }) => {
    if (roomExists(pin)) {
      const player = { id: socket.id, name, score: 0 }
      addPlayerToRoom(pin, player)

      socket.join(pin)
      socket.emit('join-success')
      io.to(pin).emit('player-joined', name)
      console.log(`✅ Người chơi ${name} đã vào phòng ${pin}`)
    } else {
      socket.emit('join-failed')
      console.log(`❌ Mã PIN không tồn tại: ${pin}`)
    }
  })

  // ✅ Lấy danh sách người chơi (trang lobby)
  socket.on('get-players', (pin) => {
    const room = getRoom(pin)
    if (room) {
      io.to(socket.id).emit('player-list', room.players)
    }
  })

  // ✅ Gửi câu hỏi đầu tiên
  socket.on('send-question', async ({ pin }) => {
    try {
      const room = await Room.findOne({ pin })
      if (!room) return

      const quiz = await Quiz.findById(room.quizId)
      if (!quiz) return

      if (!roomMemory[pin]) {
        roomMemory[pin] = { index: 0 }
      }

      const index = roomMemory[pin].index
      const question = quiz.questions[index]

      if (question) {
        socket.emit('receive-question', question)
        console.log(`📨 Gửi câu hỏi ${index + 1} cho phòng ${pin}`)
      } else {
        socket.emit('game-results')
        console.log(`🏁 Hết câu hỏi, gửi game-results`)
      }
    } catch (err) {
      console.error('❌ Lỗi khi gửi câu hỏi:', err)
    }
  })

  // ✅ Chuyển sang câu tiếp theo
  socket.on('next-question', async (pin) => {
    if (!roomMemory[pin]) return
    roomMemory[pin].index++

    const room = await Room.findOne({ pin })
    const quiz = await Quiz.findById(room.quizId)
    const index = roomMemory[pin].index

    if (quiz && index < quiz.questions.length) {
      const next = quiz.questions[index]
      io.to(pin).emit('receive-question', next)
      console.log(`➡️ Gửi câu tiếp theo ${index + 1}`)
    } else {
      io.to(pin).emit('game-results')
      console.log(`🏁 Kết thúc game cho phòng ${pin}`)
    }
  })

  // ✅ Socket disconnect
  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id)
    // Có thể thêm xoá player ở đây nếu cần
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
