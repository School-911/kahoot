import Room from '../models/Room.js'

export const createRoom = async (req, res) => {
  try {
    const { pin, quizId, hostName } = req.body
    console.log('📥 Nhận yêu cầu tạo room:', { pin, quizId, hostName })

    const room = new Room({ pin, quizId, hostName })
    await room.save()

    console.log('✅ Room đã lưu:', room._id)
    res.status(201).json({ message: 'Room created', roomId: room._id })
  } catch (err) {
    console.error('❌ Lỗi tạo phòng:', err)
    res.status(500).json({ message: 'Lỗi khi tạo phòng' })
  }
}
