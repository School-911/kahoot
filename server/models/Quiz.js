const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  createdBy: String, // tên hoặc id người tạo (simple)
  createdAt: { type: Date, default: Date.now },
  questions: [
    {
      question: String,
      answers: [String],
      correctIndex: Number
    }
  ]
});

module.exports = mongoose.model('Quiz', quizSchema);
