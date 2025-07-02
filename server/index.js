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

// RAM room manager
import {
  roomExists,
  addPlayerToRoom,
  getRoom,
  createRoom,
  addQuestionsToRoom
} from './roomManager.js'

// MongoDB Models
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

// REST API routes
app.use('/api', authRoutes)
app.use('/api', quizRoutes)
app.use('/api', roomRoutes)
app.get('/', (req, res) => res.send('Kahoot backend is running!'))

// Memory to track question index
const roomMemory = {} // { pin: { index: 0 } }

// Socket.IO
const io = new Server(server, { cors: corsOptions })

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id)

  // ✅ Host tạo phòng → lấy quiz từ MongoDB
  socket.on('host-join', async (pin) => {
    console.log(`🎮 Host tạo phòng với mã PIN ${pin}`)

    const roomInDB = await Room.findOne({ pin })
    if (!roomInDB) {
      console.log(`❌ Không tìm thấy room trong DB với pin ${pin}`)
      socket.emit('room-not-found')
      return
    }

    // Lấy câu hỏi từ Quiz
    const quiz = await Quiz.findById(roomInDB.quizId)
    if (!quiz || quiz.questions.length === 0) {
      socket.emit('quiz-not-found')
      return
    }

    const shuffled = quiz.questions.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 10)

    // Tạo room RAM và lưu câu hỏi + index
    createRoom(pin, socket.id)
    addQuestionsToRoom(pin, selected)
    roomMemory[pin] = { index: 0 }

    socket.join(pin)
    console.log(`✅ Room RAM tạo thành công với ${selected.length} câu`)
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

  // ✅ Gửi câu hỏi đầu tiên hoặc tiếp theo
  socket.on('send-question', ({ pin }) => {
    const room = getRoom(pin)
    if (!room || !room.questions) return

    const index = roomMemory[pin]?.index || 0
    const question = room.questions[index]

    if (question) {
      socket.emit('receive-question', question)
      console.log(`📨 Gửi câu hỏi ${index + 1} cho phòng ${pin}`)
    } else {
      socket.emit('game-results')
      console.log(`🏁 Hết 10 câu hỏi`)
    }
  })

  // ✅ Câu tiếp theo
  socket.on('next-question', (pin) => {
    if (!roomMemory[pin]) return
    roomMemory[pin].index++

    const room = getRoom(pin)
    const index = roomMemory[pin].index

    if (room && index < room.questions.length) {
      const next = room.questions[index]
      io.to(pin).emit('receive-question', next)
      console.log(`➡️ Gửi câu hỏi ${index + 1}`)
    } else {
      io.to(pin).emit('game-results')
      console.log(`🏁 Kết thúc quiz`)
    }
  })

  // ✅ Trang lobby yêu cầu danh sách người chơi
  socket.on('get-players', (pin) => {
    const room = getRoom(pin)
    if (room) {
      io.to(socket.id).emit('player-list', room.players)
    }
  })

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id)
    // (Tùy chọn) Xoá người chơi khỏi room RAM nếu cần
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
  