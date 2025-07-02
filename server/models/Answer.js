const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  roomPin: String,
  playerName: String,
  questionIndex: Number,
  selectedAnswer: Number,
  isCorrect: Boolean,
  timeTaken: Number, // nếu có
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);
