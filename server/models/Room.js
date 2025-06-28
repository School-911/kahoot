const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  pin: String,
  quizId: mongoose.Types.ObjectId,
  hostName: String,
  players: [
    {
      name: String,
      score: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
