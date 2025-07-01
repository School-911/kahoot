// server/socket/joinRoom.js
const rooms = new Map()

export function registerJoinRoomHandler(io, socket) {
  socket.on('join-room', ({ roomId, player }) => {
    if (!roomId || !player || !player.id) {
      socket.emit('error', 'Thiếu thông tin phòng hoặc người chơi')
      return
    }

    socket.join(roomId)

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        players: []
      })
    }

    const room = rooms.get(roomId)

    const existed = room.players.find(p => p.id === player.id)
    if (!existed) {
      room.players.push(player)
    }

    io.to(roomId).emit('room-updated', {
      roomId,
      players: room.players
    })

    console.log(`👤 ${player.name} đã vào phòng ${roomId}`)
  })
}
