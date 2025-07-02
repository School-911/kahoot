import mongoose from 'mongoose'

const quizSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  questions: [
    {
      question: String,
      answers: [String],
      correctIndex: Number
    }
  ]
})

const Quiz = mongoose.model('Quiz', quizSchema)
export default Quiz
