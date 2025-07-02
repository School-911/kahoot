// ✅ socketHandler.js
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
  getPlayersInRoom,
  setCurrentQuestionIndex,
  resetRoom
} from './roomManager.js'

const roomData = {}

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id)

    socket.on('host-join', async (pin) => {
      const room = await Room.findOne({ pin })
      if (!room) return socket.emit('room-not-found')

      createRoom(pin, socket.id)
      socket.join(pin)

      const quiz = await Quiz.findById(room.quizId)
      if (!quiz) return

      roomData[pin] = {
        questions: quiz.questions,
        currentIndex: 0
      }

      console.log(`🎮 Host đã tạo room ${pin}`)
    })

    socket.on('join-game', ({ pin, name }) => {
      if (!roomExists(pin)) return socket.emit('join-failed')

      const player = { id: socket.id, name, score: 0 }
      addPlayerToRoom(pin, player)

      socket.join(pin)
      socket.emit('join-success')
    })

    socket.on('get-questions', (pin) => {
      const data = roomData[pin]
      if (data) {
        socket.emit('question-list', data.questions)
      }
    })

    socket.on('select-question', ({ pin, index }) => {
      const data = roomData[pin]
      if (!data || !data.questions[index]) return

      data.currentIndex = index
      setCurrentQuestionIndex(pin, index)

      const question = data.questions[index]
      io.to(pin).emit('receive-question', {
        question: question.question,
        answers: question.answers,
        index
      })

      console.log(`📤 Đã chiếu câu ${index + 1} cho phòng ${pin}`)
    })

    socket.on('answer-selected', async ({ pin, answerIndex }) => {
      const room = getRoom(pin)
      const data = roomData[pin]
      if (!room || !data) return

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

    socket.on('end-game', (pin) => {
      const players = getPlayersInRoom(pin)
      io.to(pin).emit('game-over', { players })

      delete roomData[pin]
      resetRoom(pin)
    })

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected:', socket.id)
    })
  })
}
