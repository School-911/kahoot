// socketHandler.js
import Room from './models/Room.js'
import Quiz from './models/Quiz.js'
import {
  roomExists,
  addPlayerToRoom,
  getRoom,
  createRoom,
  addQuestionsToRoom
} from './roomManager.js'

const roomQuestions = {} // { pin: { usedIndexes: [], questions: [] } }

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id)

    socket.on('answer-selected', ({ pin, answerIndex }) => {
      const room = getRoom(pin)
      if (!room) return

      const player = room.players.find(p => p.id === socket.id)
      if (!player) return

      const r = roomQuestions[pin]
      if (!r || r.usedIndexes.length === 0) return

      const lastIndex = r.usedIndexes.at(-1)
      const question = r.questions[lastIndex]

      if (answerIndex === question.correctIndex) {
        player.score = (player.score || 0) + 1000 // Cộng 1000 điểm nếu đúng
      }
    })

    socket.on('host-join', async (pin) => {
      const roomInDB = await Room.findOne({ pin })
      if (!roomInDB) {
        socket.emit('room-not-found')
        return
      }

      createRoom(pin, socket.id)
      socket.join(pin)
      console.log(`🎮 Host đã tạo room ${pin}`)
    })

    socket.on('add-questions', ({ pin, questions }) => {
      addQuestionsToRoom(pin, questions)
      console.log(`📚 Đã lưu câu hỏi cho phòng ${pin}`)
    })

    socket.on('join-game', ({ pin, name }) => {
      if (roomExists(pin)) {
        const player = { id: socket.id, name, score: 0 }
        addPlayerToRoom(pin, player)

        socket.join(pin)
        socket.emit('join-success')
        io.to(pin).emit('player-joined', name)

        console.log(`✅ Người chơi ${name} đã tham gia phòng ${pin}`)
      } else {
        socket.emit('join-failed')
        console.log(`❌ Mã PIN không tồn tại: ${pin}`)
      }
    })

    socket.on('get-players', (pin) => {
      const room = getRoom(pin)
      if (room) {
        io.to(socket.id).emit('player-list', room.players)
      }
    })

    socket.on('send-question', async ({ pin }) => {
      try {
        if (!roomQuestions[pin]) {
          const room = await Room.findOne({ pin })
          if (!room) return socket.emit('room-not-found')

          const quiz = await Quiz.findById(room.quizId)
          if (!quiz || quiz.questions.length === 0) {
            return socket.emit('no-questions')
          }

          roomQuestions[pin] = {
            usedIndexes: [],
            questions: quiz.questions
          }
        }
      } catch (err) {
        console.error('❌ Lỗi khi gửi câu hỏi đầu tiên:', err)
      }
    })

    socket.on('next-question', ({ pin, index }) => {
      sendQuestion(pin, io, index)
    })

    socket.on('end-game', (pin) => {
      const room = getRoom(pin)
      if (room) {
        io.to(pin).emit('game-over', {
          players: room.players || []
        })
        delete roomQuestions[pin]
      }
    })

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected:', socket.id)
    })
  })
}

function sendQuestion(pin, io, index = null) {
  const r = roomQuestions[pin]
  if (!r || r.questions.length === 0) return

  const room = getRoom(pin)
  if (!room) return

  if (index === null || index >= r.questions.length) return

  if (!r.usedIndexes.includes(index)) {
    r.usedIndexes.push(index)
  }

  const question = r.questions[index]
  io.to(pin).emit('receive-question', {
    index,
    question: question.question,
    answers: question.answers
  })
}