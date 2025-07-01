// server/routes/cauHoiRoutes.js
import express from 'express'
import {
  taoCauHoi,
  layTatCaCauHoi,
  layCauHoiTheoId,
  capNhatCauHoi,
  xoaCauHoi
} from '../controllers/cauHoiController.js'

const router = express.Router()

router.post('/', taoCauHoi)
router.get('/', layTatCaCauHoi)
router.get('/:id', layCauHoiTheoId)
router.put('/:id', capNhatCauHoi)
router.delete('/:id', xoaCauHoi)

export default router
