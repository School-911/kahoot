<template>
  <div class="container mt-5 text-center">
    <h2 class="mb-4 text-primary">🎯 Quản lý câu hỏi</h2>

    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="list-group mb-4">
          <button
            v-for="(q, idx) in questions"
            :key="idx"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            @click="sendQuestion(idx)"
          >
            <span class="text-start">{{ idx + 1 }}. {{ q.question }}</span>
            <span class="badge bg-primary">Chiếu</span>
          </button>
        </div>

        <button class="btn btn-danger mt-3" @click="endGame">
          🔚 Kết thúc trò chơi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import socket from '../socket'

const route = useRoute()
const router = useRouter()
const pin = route.params.pin
const questions = ref([])

onMounted(() => {
  socket.emit('get-questions', pin)

  socket.on('question-list', (data) => {
    questions.value = data
  })

  socket.on('game-over', () => {
    router.push(`/host/${pin}/results`)
  })
})

const sendQuestion = (index) => {
  socket.emit('next-question', { pin, index })
}

const endGame = () => {
  socket.emit('end-game', pin)
}
</script>
