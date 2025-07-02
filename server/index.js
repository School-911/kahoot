import express from 'express'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: 'https://kahoot-4f1i.onrender.com',
  credentials: false
}))
app.use(express.json())

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected')
}).catch(err => {
  console.error('❌ MongoDB connection error:', err)
})

// Route đăng ký người dùng
app.use('/api', authRoutes)

// Route test
app.get('/', (req, res) => {
  res.send('Kahoot backend is running!')
})

// Khởi tạo server và socket
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'https://kahoot-4f1i.onrender.com',
    methods: ['GET', 'POST'],
    credentials: false
  }
})

io.on('connection', (socket) => {
  console.log('🟢 New socket connected:', socket.id)

  socket.on('ping', () => {
    socket.emit('pong')
  })

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id)
  })
})

// Lắng nghe server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
