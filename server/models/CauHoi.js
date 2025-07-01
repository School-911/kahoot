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

export default mongoose.model('CauHoi', cauHoiSchema)
