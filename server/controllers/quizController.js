import Quiz from '../models/Quiz.js'

export const createQuiz = async (req, res) => {
  try {
    const { title, createdBy, questions } = req.body
    console.log('📥 Nhận yêu cầu tạo quiz:', { title, createdBy })

    const newQuiz = new Quiz({ title, createdBy, questions })
    await newQuiz.save()

    console.log('✅ Quiz đã lưu:', newQuiz._id)
    res.status(201).json({ message: 'Quiz created', quizId: newQuiz._id })
  } catch (err) {
    console.error('❌ Lỗi tạo quiz:', err)
    res.status(500).json({ message: 'Lỗi khi tạo quiz' })
  }
}

// ✅ Thêm vào dưới createQuiz
export const getRandomQuiz = async (req, res) => {
  try {
    const count = await Quiz.countDocuments()
    const random = Math.floor(Math.random() * count)
    const quiz = await Quiz.findOne().skip(random)

    if (!quiz) {
      return res.status(404).json({ message: 'Không có quiz nào' })
    }

    res.json(quiz)
  } catch (err) {
    console.error('❌ Lỗi lấy quiz ngẫu nhiên:', err)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

