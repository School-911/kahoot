import express from 'express'
import { createQuiz, getRandomQuiz } from '../controllers/quizController.js'

const router = express.Router()
router.post('/quizzes', createQuiz)
router.get('/quizzes/random', getRandomQuiz) 
export default router
