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
  addQuestionsToRoom,
  getCurrentQuestion,
  nextQuestion
} from './roomManager.js'

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

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected')
}).catch(err => {
  console.error('❌ MongoDB connection error:', err)
})

app.use('/api', authRoutes)
app.use('/api', quizRoutes)
app.use('/api', roomRoutes)
app.get('/', (req, res) => res.send('Kahoot backend is running!'))

const io = new Server(server, {
  cors: corsOptions
})

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id)

  // 👉 Khi host tạo phòng xong thì gọi host-join
  socket.on('host-join', async (pin) => {
    console.log(`🎮 Host tạo phòng với mã PIN ${pin}`)

    const roomInDB = await Room.findOne({ pin })
    if (!roomInDB) {
      console.log(`❌ Không tìm thấy room trong DB với mã pin ${pin}`)
      socket.emit('room-not-found')
      return
    }

    const quiz = await Quiz.findById(roomInDB.quizId)
    if (!quiz || quiz.questions.length === 0) {
      console.log(`❌ Không tìm thấy câu hỏi`)
      socket.emit('no-questions')
      return
    }

    // Lấy 10 câu random từ quiz
    const shuffled = quiz.questions.sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffled.slice(0, 10)

    createRoom(pin, socket.id)
    addQuestionsToRoom(pin, selectedQuestions)
    socket.join(pin)

    console.log(`✅ Room RAM tạo thành công cho mã pin ${pin}`)
  })

  // 👉 Người chơi tham gia game
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

  // 👉 Gửi câu hỏi cho host
  socket.on('send-question', ({ pin }) => {
    const question = getCurrentQuestion(pin)
    if (question) {
      io.to(pin).emit('receive-question', question)
    } else {
      io.to(pin).emit('game-results') // hết câu hỏi
    }
  })

  // 👉 Chuyển sang câu hỏi tiếp theo
  socket.on('next-question', (pin) => {
  const room = getRoom(pin)
  if (!room) return

  // 👉 Tăng index nếu còn câu hỏi
  if (room.currentQuestionIndex < room.questions.length - 1) {
    nextQuestion(pin)
    const question = getCurrentQuestion(pin)
    io.to(pin).emit('receive-question', question)
  } else {
    // 👉 Hết câu hỏi
    io.to(pin).emit('game-results')
  }
})

  // 👉 Lấy danh sách người chơi (cho lobby)
  socket.on('get-players', (pin) => {
    const room = getRoom(pin)
    if (room) {
      io.to(socket.id).emit('player-list', room.players)
    }
  })

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
