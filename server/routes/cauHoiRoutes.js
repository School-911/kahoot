// routes/cauHoiRoutes.js
import express from 'express'
import {
  taoCauHoi,
  layTatCaCauHoi,
  layCauHoiTheoId,
  layCauHoiNgauNhien,
  capNhatCauHoi,
  xoaCauHoi
} from '../controllers/cauHoiController.js'

const router = express.Router()

router.post('/', taoCauHoi)                    // Tạo câu hỏi
router.get('/ngau-nhien', layCauHoiNgauNhien)  // Lấy 1 câu ngẫu nhiên
router.get('/', layTatCaCauHoi)                // Lấy tất cả
router.get('/:id', layCauHoiTheoId)            // Lấy theo id
router.put('/:id', capNhatCauHoi)              // Cập nhật theo id
router.delete('/:id', xoaCauHoi)               // Xoá theo id

export default router
