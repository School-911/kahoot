import CauHoi from '../models/CauHoi.js'

// 🟢 [POST] Tạo câu hỏi
export const taoCauHoi = async (req, res) => {
  try {
    const { noiDung, dapAn, dapAnDung } = req.body

    // Kiểm tra dữ liệu đầu vào
    if (
      !noiDung ||
      typeof noiDung !== 'string' ||
      !Array.isArray(dapAn) ||
      dapAn.length < 2 ||
      dapAn.some(d => typeof d !== 'string' || d.trim() === '') ||
      typeof dapAnDung !== 'string' ||
      !dapAn.includes(dapAnDung)
    ) {
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại nội dung và đáp án.'
      })
    }

    const cauHoiMoi = new CauHoi({
      noiDung: noiDung.trim(),
      dapAn: dapAn.map(d => d.trim()),
      dapAnDung: dapAnDung.trim()
    })

    await cauHoiMoi.save()
    res.status(201).json(cauHoiMoi)
  } catch (err) {
    console.error('❌ Lỗi khi tạo câu hỏi:', err.message)
    res.status(500).json({ error: 'Không thể lưu câu hỏi vào cơ sở dữ liệu' })
  }
}

// 🟡 [GET] Lấy toàn bộ câu hỏi
export const layTatCaCauHoi = async (req, res) => {
  try {
    const danhSach = await CauHoi.find()
    res.json(danhSach)
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách câu hỏi:', err.message)
    res.status(500).json({ error: 'Không thể lấy danh sách câu hỏi' })
  }
}

// 🟢 [GET] Lấy 1 câu hỏi ngẫu nhiên
export const layCauHoiNgauNhien = async (req, res) => {
  try {
    const cauHoi = await CauHoi.aggregate([{ $sample: { size: 1 } }])
    if (!cauHoi.length) {
      return res.status(404).json({ error: 'Không có câu hỏi nào trong cơ sở dữ liệu' })
    }
    res.json(cauHoi[0])
  } catch (err) {
    console.error('❌ Lỗi khi lấy câu hỏi ngẫu nhiên:', err.message)
    res.status(500).json({ error: 'Không lấy được câu hỏi ngẫu nhiên' })
  }
}

// 🟢 [GET] Lấy 1 câu hỏi theo ID
export const layCauHoiTheoId = async (req, res) => {
  try {
    const cauHoi = await CauHoi.findById(req.params.id)
    if (!cauHoi) {
      return res.status(404).json({ error: 'Không tìm thấy câu hỏi' })
    }
    res.json(cauHoi)
  } catch (err) {
    console.error('❌ Lỗi khi lấy câu hỏi theo ID:', err.message)
    res.status(500).json({ error: 'Lỗi khi tìm câu hỏi theo ID' })
  }
}

// 🟡 [PUT] Cập nhật câu hỏi
export const capNhatCauHoi = async (req, res) => {
  try {
    const cauHoi = await CauHoi.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!cauHoi) {
      return res.status(404).json({ error: 'Không tìm thấy câu hỏi để cập nhật' })
    }
    res.json(cauHoi)
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật câu hỏi:', err.message)
    res.status(500).json({ error: 'Cập nhật thất bại' })
  }
}

// 🔴 [DELETE] Xóa câu hỏi
export const xoaCauHoi = async (req, res) => {
  try {
    const cauHoi = await CauHoi.findByIdAndDelete(req.params.id)
    if (!cauHoi) {
      return res.status(404).json({ error: 'Không tìm thấy câu hỏi để xoá' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error('❌ Lỗi khi xoá câu hỏi:', err.message)
    res.status(500).json({ error: 'Xoá thất bại' })
  }
}
