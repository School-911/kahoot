// server/models/room.js

// Dữ liệu tạm thời lưu trong bộ nhớ (sau này có thể dùng MongoDB hoặc Redis)
const rooms = {} // { roomId: { players: [], started: false } }

export function createRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      started: false
    }
  }
  return rooms[roomId]
}

export function getRoom(roomId) {
  return rooms[roomId]
}

export function addPlayerToRoom(roomId, player) {
  const room = createRoom(roomId)
  if (!room.players.some(p => p.id === player.id)) {
    room.players.push(player)
  }
  return room
}

export function startGame(roomId) {
  if (rooms[roomId]) {
    rooms[roomId].started = true
  }
  return rooms[roomId]
}
