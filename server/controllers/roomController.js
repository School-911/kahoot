import Room from '../models/Room.js'

export const createRoom = async (req, res) => {
  try {
    const { pin, quizId, hostName } = req.body
    const room = new Room({ pin, quizId, hostName })
    await room.save()
    res.status(201).json({ message: 'Room created', roomId: room._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Lỗi khi tạo phòng' })
  }
}
