<template>
  <div class="container mt-5 text-center">
    <h2 class="mb-4">📋 Danh sách câu hỏi</h2>
    <ul class="list-group w-75 mx-auto">
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-for="(q, idx) in questions"
        :key="idx"
      >
        {{ idx + 1 }}. {{ q.question }}
        <button class="btn btn-sm btn-primary" @click="sendQuestion(idx)">
          ▶️ Chiếu câu này
        </button>
      </li>
    </ul>

    <button class="btn btn-danger mt-4" @click="endGame">❌ Kết thúc trò chơi</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import socket from '../socket'

const pin = useRoute().params.pin
const router = useRouter()
const questions = ref([])

onMounted(() => {
  socket.emit('host-join', pin) // Host đăng nhập
  socket.emit('get-questions', pin)

  socket.on('question-list', (list) => {
    questions.value = list
  })

  socket.on('game-over', () => {
    router.push(`/host/${pin}/results`)
  })
})

const sendQuestion = (index) => {
  socket.emit('admin-send-question', { pin, index })
}

const endGame = () => {
  socket.emit('game-over', { pin })
}
</script>
