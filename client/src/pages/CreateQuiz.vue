<template>
  <div class="container mt-5">
    <h2 class="fw-bold mb-4">Tạo câu hỏi</h2>

    <!-- Ô nhập câu hỏi -->
    <input
      v-model="questionText"
      class="form-control form-control-lg mb-4"
      placeholder="Điền câu hỏi tại đây..."
    />
    <!-- Đáp án -->
    <div v-for="(answer, index) in answers" :key="index" class="input-group mb-3">
      <span
        class="input-group-text"
        :class="bgColors[index % bgColors.length]"
        style="color: white; font-weight: bold"
      >
        {{ iconShapes[index] }}
      </span>
      <input
        v-model="answer.text"
        class="form-control"
        :placeholder="`Thêm đáp án ${index + 1}${index > 1 ? ' (không bắt buộc)' : ''}`"
      />
      <div class="input-group-text">
        <input type="radio" v-model="correctAnswer" :value="index" />
      </div>
    </div>

    <div class="d-flex justify-content-between mt-4">
      <div>
        <button class="btn btn-outline-secondary me-2" @click="alert('Chức năng đang phát triển')">
        📄 Nhập từ file Notepad
      </button>
      </div>
    </div>

    <div class="d-flex justify-content-between mt-4">
      <button class="btn btn-secondary" @click="addQuestion">Thêm câu hỏi</button>
      <button class="btn btn-success" @click="saveQuiz">
        <i class="bi bi-cloud-arrow-up-fill me-1"></i>Lưu & Tạo phòng
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import socket from '../socket'
import axios from 'axios'

const router = useRouter()
const questionText = ref('')
const answers = ref([{ text: '' }, { text: '' }, { text: '' }, { text: '' }])
const correctAnswer = ref(null)
const questions = ref([])

const bgColors = ['bg-danger', 'bg-primary', 'bg-warning', 'bg-success']
const iconShapes = ['▲', '●', '■', '□'] // Đỏ, Xanh, Vàng, Xanh lá

const addQuestion = () => {
  if (!questionText.value || correctAnswer.value === null) return
  questions.value.push({
    question: questionText.value,
    answers: answers.value.map((a) => a.text),
    correctIndex: correctAnswer.value
  })
  questionText.value = ''
  answers.value = [{ text: '' }, { text: '' }, { text: '' }, { text: '' }]
  correctAnswer.value = null
}

const saveQuiz = async () => {
  if (questions.value.length === 0) {
    return alert('Hãy thêm ít nhất 1 câu hỏi')
  }

  const pin = Math.floor(1000 + Math.random() * 9000).toString()
  const title = 'Quiz của tôi'
  const createdBy = JSON.parse(localStorage.getItem('user'))?.name || 'Không tên'

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/quizzes`, {
      title,
      createdBy,
      questions: questions.value
    })

    const quizId = res.data.quizId

    await axios.post(`${import.meta.env.VITE_API_URL}/api/rooms`, {
      pin,
      quizId,
      hostName: createdBy
    })

    socket.emit('host-join', pin)
    socket.emit('add-questions', { pin, questions: questions.value })
    router.push(`/host/${pin}`)
  } catch (err) {
    console.error(err)
    alert('Lỗi khi lưu quiz hoặc tạo phòng!')
  }
}
</script>

<style scoped>
input[type='radio'] {
  width: 20px;
  height: 20px;
}
</style>