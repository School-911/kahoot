// ✅ roomManager.js
const rooms = {}

function createRoom(pin, hostSocketId) {
  rooms[pin] = {
    host: hostSocketId,
    players: [],
    questions: [],
    currentQuestionIndex: 0
  }
}

function roomExists(pin) {
  return !!rooms[pin]
}

function addPlayerToRoom(pin, player) {
  if (rooms[pin]) {
    rooms[pin].players.push(player)
  }
}

function getPlayersInRoom(pin) {
  return rooms[pin]?.players || []
}

function getRoom(pin) {
  return rooms[pin]
}

function addQuestionsToRoom(pin, questions) {
  if (rooms[pin]) {
    rooms[pin].questions = questions
  }
}

function getCurrentQuestion(pin) {
  const room = rooms[pin]
  if (!room) return null
  return room.questions[room.currentQuestionIndex]
}

function setCurrentQuestionIndex(pin, index) {
  if (rooms[pin]) {
    rooms[pin].currentQuestionIndex = index
  }
}

function resetRoom(pin) {
  delete rooms[pin]
}

export {
  createRoom,
  roomExists,
  addPlayerToRoom,
  getPlayersInRoom,
  getRoom,
  addQuestionsToRoom,
  getCurrentQuestion,
  setCurrentQuestionIndex,
  resetRoom
}
