import mongoose from 'mongoose'

// Khai báo schema cho câu hỏi
const cauHoiSchema = new mongoose.Schema({
  noiDung: {
    type: String,
    required: true
  },
  luaChon: {
    type: [String],
    required: true,
    validate: [arr => arr.length >= 2, 'Phải có ít nhất 2 đáp án']
  },
  dapAnDung: {
    type: Number,
    required: true,
    validate: {
      validator: function (val) {
        return this.luaChon && val >= 0 && val < this.luaChon.length
      },
      message: 'Vị trí đáp án đúng không hợp lệ'
    }
  }
}, { timestamps: true }) // Tự động thêm createdAt, updatedAt

// Tạo model để thao tác với collection 'cauhois'
export default mongoose.model('CauHoi', cauHoiSchema)
