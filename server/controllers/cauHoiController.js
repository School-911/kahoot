// controllers/cauHoiController.js
import CauHoi from '../models/CauHoi.js'

export const taoCauHoi = async (req, res) => {
  try {
    const cauHoiMoi = new CauHoi(req.body)
    await cauHoiMoi.save()
    res.status(201).json(cauHoiMoi)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Không thể lưu câu hỏi', message: err.message })
  }
}

export const layTatCaCauHoi = async (req, res) => {
  try {
    const ds = await CauHoi.find()
    res.json(ds)
  } catch (err) {
    res.status(500).json({ error: 'Không thể lấy câu hỏi', message: err.message })
  }
}

export const layCauHoiTheoId = async (req, res) => {
  try {
    const cauHoi = await CauHoi.findById(req.params.id)
    if (!cauHoi) return res.status(404).json({ error: 'Không tìm thấy câu hỏi' })
    res.json(cauHoi)
  } catch (err) {
    res.status(500).json({ error: 'Không thể lấy câu hỏi', message: err.message })
  }
}

export const layCauHoiNgauNhien = async (req, res) => {
  try {
    const cauHoi = await CauHoi.aggregate([{ $sample: { size: 1 } }])
    res.json(cauHoi[0])
  } catch (err) {
    res.status(500).json({ error: 'Không lấy được câu hỏi', message: err.message })
  }
}

export const capNhatCauHoi = async (req, res) => {
  try {
    const cauHoi = await CauHoi.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!cauHoi) return res.status(404).json({ error: 'Không tìm thấy câu hỏi' })
    res.json(cauHoi)
  } catch (err) {
    res.status(500).json({ error: 'Cập nhật thất bại', message: err.message })
  }
}

export const xoaCauHoi = async (req, res) => {
  try {
    const ketQua = await CauHoi.findByIdAndDelete(req.params.id)
    if (!ketQua) return res.status(404).json({ error: 'Không tìm thấy câu hỏi để xoá' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Xoá thất bại', message: err.message })
  }
}
