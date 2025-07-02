import { Server } from 'socket.io'
import Room from './models/Room.js'
import Quiz from './models/Quiz.js'
import Answer from './models/Answer.js'
import {
  createRoom,
  roomExists,
  addPlayerToRoom,
  addQuestionsToRoom,
  getRoom,
  getPlayersInRoom
} from './roomManager.js'

const roomData = {} // Lưu câu hỏi đã load từ DB

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id)

    // ✅ Host tạo phòng
    socket.on('host-join', async (pin) => {
      const room = await Room.findOne({ pin })
      if (!room) {
        socket.emit('room-not-found')
        return
      }

      createRoom(pin, socket.id)
      socket.join(pin)

      // Lấy quiz từ DB
      const quiz = await Quiz.findById(room.quizId)
      if (!quiz) return

      roomData[pin] = {
        questions: quiz.questions,
        currentIndex: 0
      }

      console.log(`🎮 Host đã tạo room ${pin}`)
    })

    // ✅ Người chơi tham gia
    socket.on('join-game', ({ pin, name }) => {
      if (!roomExists(pin)) {
        socket.emit('join-failed')
        return
      }

      const player = { id: socket.id, name, score: 0 }
      addPlayerToRoom(pin, player)

      socket.join(pin)
      socket.emit('join-success')
      io.to(pin).emit('player-joined', name)
    })

    // ✅ Host gửi danh sách câu hỏi
    socket.on('add-questions', ({ pin, questions }) => {
      addQuestionsToRoom(pin, questions)
    })

    // ✅ Host yêu cầu gửi danh sách câu hỏi
    socket.on('get-questions', (pin) => {
      const data = roomData[pin]
      if (data) {
        io.to(socket.id).emit('question-list', data.questions)
      }
    })

    // ✅ Host chọn câu hỏi để chiếu
    socket.on('select-question', ({ pin, index }) => {
      const data = roomData[pin]
      if (!data || !data.questions[index]) return

      data.currentIndex = index

      const question = data.questions[index]
      io.to(pin).emit('receive-question', {
        question: question.question,
        answers: question.answers,
        index
      })

      console.log(`📤 Câu hỏi ${index + 1} đã được chiếu tới phòng ${pin}`)
    })

    // ✅ Người chơi gửi câu trả lời
    socket.on('answer-selected', async ({ pin, answerIndex }) => {
      const room = getRoom(pin)
      if (!room) return

      const data = roomData[pin]
      if (!data) return

      const question = data.questions[data.currentIndex]
      const isCorrect = answerIndex === question.correctIndex

      const player = room.players.find(p => p.id === socket.id)
      if (player) {
        if (isCorrect) player.score += 1000

        try {
          await Answer.create({
            roomPin: pin,
            playerName: player.name,
            questionIndex: data.currentIndex,
            selectedAnswer: answerIndex,
            isCorrect
          })
        } catch (err) {
          console.error('❌ Lỗi khi lưu câu trả lời:', err)
        }

        io.to(socket.id).emit('answer-result', { isCorrect })
      }
    })

    // ✅ Kết thúc game
    socket.on('end-game', (pin) => {
      const players = getRoom(pin)?.players || []
      io.to(pin).emit('game-over', { players })
      delete roomData[pin]
    })

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected:', socket.id)
    })
  })
}
