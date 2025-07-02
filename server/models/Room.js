import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
  pin: String,
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  hostName: String,
  players: [
    {
      name: String,
      score: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
})

const Room = mongoose.model('Room', roomSchema)
export default Room
