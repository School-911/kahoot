// server/routes/choigame.js
import express from 'express'
import { layCauHoiNgauNhien, layTatCaCauHoi } from '../controllers/cauHoiController.js'

const router = express.Router()

// ✅ Route lấy 1 câu hỏi ngẫu nhiên
router.get('/random', layCauHoiNgauNhien)

// ✅ Route lấy toàn bộ câu hỏi (tùy game muốn dùng nhiều)
router.get('/all', layTatCaCauHoi)

export default router
