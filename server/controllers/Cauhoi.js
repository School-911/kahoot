// server/controllers/Cauhoi.js
import CauHoi from '../models/cauhoimodel.js'

export const layCauHoiNgauNhien = async (req, res) => {
  try {
    const soLuong = parseInt(req.query.soLuong) || 5
    const danhSach = await CauHoi.aggregate([{ $sample: { size: soLuong } }])
    res.json(danhSach)
  } catch (err) {
    console.error('❌ Lỗi khi lấy câu hỏi:', err)
    res.status(500).json({ message: 'Không thể lấy câu hỏi' })
  }
}
