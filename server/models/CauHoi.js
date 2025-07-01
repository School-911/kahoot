// server/models/cauhoimodel.js
import mongoose from 'mongoose'

const cauHoiSchema = new mongoose.Schema({
  noiDung: {
    type: String,
    default: ''
  },
  luaChon: {
    type: [String],
    default: []
  },
  dapAnDung: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

// ✅ Fix lỗi OverwriteModelError
const CauHoi = mongoose.models.CauHoi || mongoose.model('CauHoi', cauHoiSchema)

export default CauHoi
