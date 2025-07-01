import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

// Tạo __dirname trong môi trường ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Khởi tạo app
dotenv.config()
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Import router và socket
import cauHoiRoutes from './routes/cauHoiRoutes.js'
import choigame from './routes/choigame.js'
import { initSocket } from './socket/index.js'

// REST API
app.use('/api/cau-hoi', cauHoiRoutes)           // cho admin tạo / sửa
app.use('/api/game-question', choigame)         // cho client lấy để chơi

// SOCKET.IO
initSocket(io)

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB'))
  .catch(err => console.error('❌ Kết nối MongoDB thất bại:', err))

// 👉 Serve static files từ Vue build
const clientPath = path.resolve(__dirname, '../client/dist')
app.use(express.static(clientPath))

// 👉 Bắt tất cả route còn lại => trả index.html (SPA)


// Lắng nghe server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
})
