import Quiz from '../models/Quiz.js'

export const createQuiz = async (req, res) => {
  try {
    const { title, createdBy, questions } = req.body
    const newQuiz = new Quiz({ title, createdBy, questions })
    await newQuiz.save()
    res.status(201).json({ message: 'Quiz created', quizId: newQuiz._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Lỗi khi tạo quiz' })
  }
}
