import Room from '../models/Room.js'
import Quiz from '../models/Quiz.js'

// ✅ Tạo phòng
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

// ✅ Lấy quiz theo mã PIN phòng
export const getQuizByPin = async (req, res) => {
  try {
    const { pin } = req.params

    const room = await Room.findOne({ pin })
    if (!room) {
      return res.status(404).json({ message: 'Không tìm thấy phòng' })
    }

    const quiz = await Quiz.findById(room.quizId)
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' })
    }

    res.json(quiz)
  } catch (err) {
    console.error('❌ Lỗi lấy quiz theo PIN:', err)
    res.status(500).json({ message: 'Lỗi server' })
  }
}
