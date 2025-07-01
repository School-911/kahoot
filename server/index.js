// server/index.js
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
    origin: '*'
  }
})

app.use(cors())
app.use(express.json())

// ✅ Các router
app.use('/api/cau-hoi', cauHoiRoutes)           // cho admin tạo / sửa
app.use('/api/game-question', choigame)         // cho client lấy để chơi

initSocket(io)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB'))
  .catch(err => console.error('❌ Kết nối MongoDB thất bại:', err))

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
})
