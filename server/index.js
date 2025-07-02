// index.js
import express from 'express'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Server } from 'socket.io'

import authRoutes from './routes/authRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import roomRoutes from './routes/roomRoutes.js'

import {
  roomExists,
  addPlayerToRoom,
  getRoom,
  createRoom,
  addQuestionsToRoom
} from './roomManager.js'


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

// Routes
app.use('/api', authRoutes)
app.use('/api', quizRoutes)
app.use('/api', roomRoutes)
app.get('/', (req, res) => res.send('Kahoot backend is running!'))

// Socket.IO
const io = new Server(server, {
  cors: corsOptions
})

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id)

  // 👉 Host tạo phòng
  socket.on('host-join', (pin) => {
    console.log(`🎮 Host tạo phòng với mã PIN ${pin}`)
    createRoom(pin, socket.id)
    socket.join(pin)
  })

  // 👉 Gửi câu hỏi từ host
  socket.on('add-questions', ({ pin, questions }) => {
    console.log(`📚 Nhận câu hỏi cho phòng ${pin}`)
    addQuestionsToRoom(pin, questions)
  })

  // 👉 Người chơi tham gia game
  socket.on('join-game', ({ pin, name }) => {
  if (roomExists(pin)) {
    const player = { id: socket.id, name, score: 0 }
    addPlayerToRoom(pin, player)

    socket.join(pin)
    socket.emit('join-success')

    // Gửi tới host: có người chơi mới
    io.to(pin).emit('player-joined', name)

    console.log(`✅ Người chơi ${name} đã vào phòng ${pin}`)
  } else {
    socket.emit('join-failed')
    console.log(`❌ Mã PIN không tồn tại: ${pin}`)
  }
})

// 👇 Cho phép trang lobby hỏi danh sách người chơi
socket.on('get-players', (pin) => {
  const room = getRoom(pin)
  if (room) {
    io.to(socket.id).emit('player-list', room.players)
  }
})


  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id)
    // (Bạn có thể thêm logic xóa player khỏi room nếu cần)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
