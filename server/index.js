import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

import cauHoiRoutes from './routes/cauHoiRoutes.js'
import choigame from './routes/choigame.js'
import { initSocket } from './socket/index.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message)
    process.exit(1)
  })

// Middleware
app.use(cors())
app.use(express.json())

// API routes
app.use('/api/cau-hoi', cauHoiRoutes)
app.use('/api/choi-game', choigame)

// Socket.IO
initSocket(io)

// Khởi động server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
})

// server/index.js

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Serve static files từ client/dist
app.use(express.static(path.join(__dirname, '../client/dist')))

// Gửi lại index.html cho tất cả route không phải API (cho Vue Router)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  }
})
