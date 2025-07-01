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

router.post('/', taoCauHoi)
router.get('/ngau-nhien', layCauHoiNgauNhien)
router.get('/', layTatCaCauHoi)
router.get('/:id', layCauHoiTheoId)
router.put('/:id', capNhatCauHoi)
router.delete('/:id', xoaCauHoi)

export default router
