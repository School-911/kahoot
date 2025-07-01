import CauHoi from '../models/CauHoi.js'

export const taoCauHoi = async (req, res) => {
  try {
    const cauHoiMoi = new CauHoi(req.body)
    await cauHoiMoi.save()
    res.status(201).json(cauHoiMoi)
  } catch (err) {
    res.status(500).json({ error: 'Không thể lưu câu hỏi' })
  }
}

export const layTatCaCauHoi = async (req, res) => {
  try {
    const ds = await CauHoi.find()
    res.json(ds)
  } catch (err) {
    res.status(500).json({ error: 'Không thể lấy câu hỏi' })
  }
}

export const capNhatCauHoi = async (req, res) => {
  try {
    const cauHoi = await CauHoi.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(cauHoi)
  } catch (err) {
    res.status(500).json({ error: 'Cập nhật thất bại' })
  }
}

export const xoaCauHoi = async (req, res) => {
  try {
    await CauHoi.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Xoá thất bại' })
  }
}

export const layCauHoiNgauNhien = async (req, res) => {
  try {
    const cauHoi = await CauHoi.aggregate([{ $sample: { size: 1 } }])
    res.json(cauHoi[0])
  } catch (err) {
    res.status(500).json({ error: 'Không lấy được câu hỏi' })
  }
}

export const layCauHoiTheoId = async (req, res) => {
  try {
    const cauHoi = await CauHoi.findById(req.params.id)
    res.json(cauHoi)
  } catch (err) {
    res.status(404).json({ error: 'Không tìm thấy' })
  }
}
