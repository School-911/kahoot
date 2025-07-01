// server/controllers/roomController.js
import {
  createRoom,
  getRoom,
  addPlayerToRoom,
  startGame
} from '../models/room.js'

export function handleJoinRoom(io, socket, { roomId, player }) {
  const room = addPlayerToRoom(roomId, player)
  socket.join(roomId)
  io.to(roomId).emit('room-updated', room)
}

export function handleStartGame(io, socket, { roomId }) {
  const room = startGame(roomId)
  if (room) {
    io.to(roomId).emit('game-started')
  }
}
