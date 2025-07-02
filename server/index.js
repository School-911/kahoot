import express from 'express'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const server = http.createServer(app)

// ✅ Cho phép origin từ client Render
const corsOptions = {
  origin: 'https://kahoot-client.onrender.com',
  credentials: true
}

// ✅ CORS cho REST API
app.use(cors(corsOptions))
app.use(express.json())

// ✅ Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected')
}).catch(err => {
  console.error('❌ MongoDB connection error:', err)
})

// ✅ Route
app.use('/api', authRoutes)
app.get('/', (req, res) => {
  res.send('Kahoot backend is running!')
})

// ✅ Socket.io với CORS
const io = new Server(server, {
  cors: corsOptions
})

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id)

  socket.on('ping', () => {
    socket.emit('pong')
  })

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
