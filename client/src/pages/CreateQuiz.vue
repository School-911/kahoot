<template>
  <div class="container mt-5">
    <h2>Tạo câu hỏi</h2>
    <input v-model="questionText" class="form-control my-3" placeholder="Nhập câu hỏi" />

    <div v-for="(answer, index) in answers" :key="index" class="input-group mb-2">
      <input v-model="answer.text" class="form-control" :placeholder="`Đáp án ${index + 1}`" />
      <div class="input-group-text">
        <input type="radio" v-model="correctAnswer" :value="index" />
      </div>
    </div>

    <button class="btn btn-info me-2" @click="addQuestion">Thêm câu hỏi</button>
    <button class="btn btn-success" @click="saveQuiz">Lưu & Tạo phòng</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import socket from '../socket'

const router = useRouter()
const questionText = ref('')
const answers = ref([{ text: '' }, { text: '' }, { text: '' }, { text: '' }])
const correctAnswer = ref(null)
const questions = ref([])

const addQuestion = () => {
  if (!questionText.value || correctAnswer.value === null) return
  questions.value.push({
    question: questionText.value,
    answers: answers.value.map(a => a.text),
    correctIndex: correctAnswer.value
  })
  questionText.value = ''
  answers.value = [{ text: '' }, { text: '' }, { text: '' }, { text: '' }]
  correctAnswer.value = null
}

import axios from 'axios'

const saveQuiz = async () => {
  if (questions.value.length === 0) {
    return alert('Hãy thêm ít nhất 1 câu hỏi')
  }

  const pin = Math.floor(1000 + Math.random() * 9000).toString()
  const title = 'Quiz của tôi'
  const createdBy = JSON.parse(localStorage.getItem('user'))?.name || 'Không tên'

  try {
    // 1. Lưu quiz vào MongoDB
    const res =  await axios.post(`${import.meta.env.VITE_API_URL}/api/quizzes`, {
      title,
      createdBy,
      questions: questions.value
    })

    const quizId = res.data.quizId

    // 2. Tạo room trên MongoDB (dùng pin, quizId, host)
    await axios.post(`${import.meta.env.VITE_API_URL}/api/rooms`, {
      pin,
      quizId,
      hostName: createdBy
    })

    // 3. Tạo room qua socket như cũ
    socket.emit('host-join', pin)
    socket.emit('add-questions', { pin, questions: questions.value })

    // 4. Chuyển đến lobby
    router.push(`/host/${pin}`)
  } catch (err) {
    console.error(err)
    alert('Lỗi khi lưu quiz hoặc tạo phòng!')
  }
}

</script>
