// server/models/cauhoii.js
import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
})

const cauHoiSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [optionSchema]
})

const CauHoi = mongoose.model('CauHoi', cauHoiSchema)

export default CauHoi
