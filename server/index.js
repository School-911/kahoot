import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

// 👉 Trỏ đúng vào file route bạn đã có
import cauHoiRoutes from './routes/cauHoiRoutes.js'

dotenv.config()

const app = express()

// Cho phép frontend gọi từ domain khác (nếu có)
app.use(cors())
// Đọc JSON từ body request
app.use(express.json())

// Đăng ký route câu hỏi
app.use('/api/cau-hoi', cauHoiRoutes)

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB Atlas'))
  .catch(err => console.error('❌ Kết nối thất bại:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
})
