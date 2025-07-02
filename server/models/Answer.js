import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  roomPin: String,
  playerName: String,
  questionIndex: Number,
  selectedAnswer: Number,
  isCorrect: Boolean,
  timeTaken: Number, // nếu có
  createdAt: { type: Date, default: Date.now }
})

const Answer = mongoose.model('Answer', answerSchema)
export default Answer
