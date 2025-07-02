// index.js
import express from 'express'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Server } from 'socket.io'

// Routes
import authRoutes from './routes/authRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import roomRoutes from './routes/roomRoutes.js'

// RAM room manager cho socket
import {
  roomExists,
  addPlayerToRoom,
  getRoom,
  createRoom,
  addQuestionsToRoom
} from './roomManager.js'

// MongoDB models
import Room from './models/Room.js'
import Quiz from './models/Quiz.js'

dotenv.config()

const app = express()
const server = http.createServer(app)

// CORS cho client render
const corsOptions = {
  origin: 'https://kahoot-client.onrender.com',
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected')
}).catch(err => {
  console.error('❌ MongoDB connection error:', err)
})

// API Routes
app.use('/api', authRoutes)
app.use('/api', quizRoutes)
app.use('/api', roomRoutes)
app.get('/', (req, res) => res.send('Kahoot backend is running!'))

// =============================
// 👉 Phần RAM lưu câu hỏi tạm
// =============================
const roomQuestions = {} // { pin: { usedIndexes: [], questions: [] } }

// =============================
// 👉 SOCKET.IO
// =============================
const io = new Server(server, { cors: corsOptions })

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id)

  // ✅ Khi host tạo phòng
  socket.on('host-join', async (pin) => {
    const roomInDB = await Room.findOne({ pin })
    if (!roomInDB) {
      socket.emit('room-not-found')
      return
    }

    createRoom(pin, socket.id)  // tạo phòng tạm trong RAM
    socket.join(pin)
    console.log(`🎮 Host đã tạo room ${pin}`)
  })

  // ✅ Gửi câu hỏi từ host sau khi tạo
  socket.on('add-questions', ({ pin, questions }) => {
    addQuestionsToRoom(pin, questions)
    console.log(`📚 Đã lưu câu hỏi cho phòng ${pin}`)
  })

  // ✅ Người chơi tham gia
  socket.on('join-game', ({ pin, name }) => {
    if (roomExists(pin)) {
      const player = { id: socket.id, name, score: 0 }
      addPlayerToRoom(pin, player)

      socket.join(pin)
      socket.emit('join-success')

      io.to(pin).emit('player-joined', name)
      console.log(`✅ Người chơi ${name} đã tham gia phòng ${pin}`)
    } else {
      socket.emit('join-failed')
      console.log(`❌ Mã PIN không tồn tại: ${pin}`)
    }
  })

  // ✅ Trang lobby lấy danh sách người chơi
  socket.on('get-players', (pin) => {
    const room = getRoom(pin)
    if (room) {
      io.to(socket.id).emit('player-list', room.players)
    }
  })

  // ================================
  // ✅ Hiển thị câu hỏi ngẫu nhiên
  // ================================
  socket.on('send-question', async ({ pin }) => {
    try {
      // Nếu chưa cache → lấy từ MongoDB
      if (!roomQuestions[pin]) {
        const room = await Room.findOne({ pin })
        if (!room) return socket.emit('room-not-found')

        const quiz = await Quiz.findById(room.quizId)
        if (!quiz || quiz.questions.length === 0) {
          return socket.emit('no-questions')
        }

        roomQuestions[pin] = {
          usedIndexes: [],
          questions: quiz.questions
        }
      }

      const r = roomQuestions[pin]

      // Nếu đã hỏi đủ 10 câu → kết thúc
      if (r.usedIndexes.length >= 10 || r.usedIndexes.length >= r.questions.length) {
        io.to(pin).emit('game-over')
        delete roomQuestions[pin]
        return
      }

      // Random câu chưa dùng
      let index
      do {
        index = Math.floor(Math.random() * r.questions.length)
      } while (r.usedIndexes.includes(index))

      r.usedIndexes.push(index)
      const question = r.questions[index]

      // Gửi câu hỏi cho cả host & người chơi
      io.to(pin).emit('receive-question', {
        question: question.question,
        answers: question.answers
      })
    } catch (err) {
      console.error('❌ Lỗi khi gửi câu hỏi:', err)
    }
  })

  // ✅ Khi host bấm "Câu tiếp theo"
  socket.on('next-question', (pin) => {
    io.to(pin).emit('send-question', { pin }) // emit lại trigger cho client gọi 'send-question'
  })

  // ✅ Ngắt kết nối
  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id)
    // Có thể xóa player nếu cần
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
