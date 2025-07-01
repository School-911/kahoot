// server/routes/choigame.js
import express from 'express'
import { layCauHoiNgauNhien } from '../controllers/Cauhoi.js'

const router = express.Router()

// Lấy câu hỏi random
// GET /api/game-question?soLuong=2
router.get('/', layCauHoiNgauNhien)

export default router
