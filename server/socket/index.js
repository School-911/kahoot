// server/socket/index.js

import { registerJoinRoom } from './joinRoom.js'

const roomsData = {} // Lưu thông tin tạm về room

export function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 Client kết nối:', socket.id)

    // Nếu bạn có logic riêng cho join-room, dùng handler này
    registerJoinRoom(io, socket, roomsData)

    // === 1. Khi người chơi tham gia phòng ===
    socket.on('join-room', ({ roomId, player }) => {
      socket.join(roomId)

      if (!roomsData[roomId]) {
        roomsData[roomId] = {
          players: [],
          questions: []
        }
      }

      const existed = roomsData[roomId].players.find(p => p.id === player.id)
      if (!existed) {
        roomsData[roomId].players.push(player)
      }

      io.to(roomId).emit('room-updated', {
        players: roomsData[roomId].players
      })
    })

    // === 2. Khi admin bắt đầu game ===
    socket.on('start-game', ({ roomId, playerId, questions }) => {
      console.log(`🚀 Game bắt đầu tại phòng ${roomId}`)

      if (!roomsData[roomId]) {
        roomsData[roomId] = {
          players: [],
          questions: []
        }
      }

      roomsData[roomId].questions = questions || []

      io.to(roomId).emit('game-started', {
        questions: roomsData[roomId].questions
      })
    })

    // === 3. Khi client rời khỏi (tạm thời không xóa khỏi phòng) ===
    socket.on('disconnect', () => {
      console.log('❌ Client rời kết nối:', socket.id)
    })
  })
}

export { roomsData } // nếu cần truy cập từ file khác
