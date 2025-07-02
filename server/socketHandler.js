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

    socket.on('host-join', async (pin) => {
      const roomInDB = await Room.findOne({ pin })
      if (!roomInDB) return socket.emit('room-not-found')

      createRoom(pin, socket.id)
      socket.join(pin)
      console.log(`🎮 Host đã tạo room ${pin}`)

      // Load quiz questions từ DB
      const quiz = await Quiz.findById(roomInDB.quizId)
      if (quiz) {
        roomQuestions[pin] = {
          usedIndexes: [],
          questions: quiz.questions
        }

        io.to(socket.id).emit('question-list', quiz.questions) // Gửi danh sách cho admin
      }
    })

    socket.on('get-questions', (pin) => {
      const r = roomQuestions[pin]
      if (r) {
        io.to(socket.id).emit('question-list', r.questions)
      }
    })

    socket.on('admin-send-question', ({ pin, index }) => {
      console.log(`📢 Admin chọn chiếu câu số ${index} trong phòng ${pin}`)
      sendQuestionByIndex(pin, index, io)
    })

    socket.on('answer-selected', ({ pin, answerIndex }) => {
      const room = getRoom(pin)
      if (!room) return

      const player = room.players.find(p => p.id === socket.id)
      if (!player) return

      const r = roomQuestions[pin]
      if (!r) return

      const lastIndex = r.usedIndexes.at(-1)
      const question = r.questions[lastIndex]
      if (!question) return

      if (answerIndex === question.correctIndex) {
        player.score = (player.score || 0) + 1000
      }
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

    socket.on('game-over', ({ pin }) => {
      const room = getRoom(pin)
      io.to(pin).emit('game-over', {
        players: room?.players || []
      })
      delete roomQuestions[pin]
    })

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected:', socket.id)
    })
  })
}

// Gửi câu hỏi theo chỉ số cụ thể
function sendQuestionByIndex(pin, index, io) {
  const r = roomQuestions[pin]
  if (!r || !r.questions[index]) return

  r.usedIndexes.push(index)
  const question = r.questions[index]

  io.to(pin).emit('receive-question', {
    question: question.question,
    answers: question.answers
  })
}
