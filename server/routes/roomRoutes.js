import express from 'express'
import { createRoom, getQuizByPin } from '../controllers/roomController.js'

const router = express.Router()

// 👉 Tạo phòng
router.post('/rooms', createRoom)

// 👉 Lấy quiz theo mã PIN
router.get('/rooms/:pin/quiz', getQuizByPin)

export default router
