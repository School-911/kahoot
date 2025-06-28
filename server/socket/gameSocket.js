// gameSocket.js - stub
const roomManager = require('./roomManager')

function registerGameSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 Kết nối:', socket.id)

    // Host tạo phòng
    socket.on('host-join', (pin) => {
      roomManager.createRoom(pin, socket.id)
      socket.join(pin)
      console.log(`📦 Phòng ${pin} được tạo bởi ${socket.id}`)
    })

    // Người chơi tham gia phòng
    socket.on('join-game', ({ pin, name }) => {
      if (!roomManager.roomExists(pin)) {
        socket.emit('join-failed')
        return
      }

      roomManager.addPlayerToRoom(pin, {
        name,
        id: socket.id,
        score: 0
      })

      socket.join(pin)
      socket.emit('join-success')
      io.to(pin).emit('player-joined', name)
    })

    // Host gửi danh sách câu hỏi
    socket.on('add-questions', ({ pin, questions }) => {
      roomManager.addQuestionsToRoom(pin, questions)
    })

    // Host gửi câu hỏi hiện tại
    socket.on('send-question', ({ pin }) => {
      const question = roomManager.getCurrentQuestion(pin)
      if (question) {
        io.to(pin).emit('receive-question', question)
      }
    })

    // Người chơi gửi đáp án
    const Answer = require('./models/Answer'); // nếu bạn dùng riêng gameSocket.js thì thêm dòng này
    socket.on('answer', async ({ pin, name, answerIndex }) => {
  const room = rooms[pin];
  if (!room) return;

  const currentQ = room.questions[room.currentQuestion];
  const isCorrect = currentQ.correctIndex === answerIndex;

  const player = room.players.find(p => p.name === name);
  if (player && isCorrect) {
    player.score += 1000;
  }

  // ⬇ Lưu kết quả trả lời vào MongoDB
  try {
    await Answer.create({
      roomPin: pin,
      playerName: name,
      questionIndex: room.currentQuestion,
      selectedAnswer: answerIndex,
      isCorrect
    });
  } catch (err) {
    console.error('❌ Lỗi khi lưu kết quả người chơi:', err);
  }

  const playerSocket = io.sockets.sockets.get(player.socketId);
  if (playerSocket) {
    playerSocket.emit('answer-result', { isCorrect });
  }
});

    // Host chuyển câu hỏi tiếp theo
    socket.on('next-question', (pin) => {
      roomManager.nextQuestion(pin)
      const question = roomManager.getCurrentQuestion(pin)
      if (question) {
        io.to(pin).emit('receive-question', question)
      } else {
        const players = roomManager.getPlayersInRoom(pin)
        io.to(pin).emit('game-results', players)
      }
    })

    // Kết thúc game
    socket.on('finish-game', (pin) => {
      const players = roomManager.getPlayersInRoom(pin)
      io.to(pin).emit('game-results', players)
    })

    // Rời khỏi phòng hoặc disconnect
    socket.on('disconnect', () => {
      console.log('🔴 Mất kết nối:', socket.id)
    })
  })
}

module.exports = registerGameSocket
