<template>
  <div class="container mt-5">
    <div class="card shadow p-4 text-center mx-auto" style="max-width: 600px;">
      <h3 class="text-primary mb-4">📢 {{ currentQuestion.question }}</h3>

      <ul class="list-group text-start">
        <li
          v-for="(ans, idx) in currentQuestion.answers"
          :key="idx"
          class="list-group-item"
        >
          <strong>{{ idx + 1 }}.</strong> {{ ans }}
        </li>
      </ul>

      <button class="btn btn-primary mt-4 w-100" @click="nextQuestion">
        ➡️ Câu tiếp theo
      </button>
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
const currentQuestion = ref({ question: '', answers: [] })

onMounted(() => {
  socket.emit('send-question', { pin })

  socket.on('receive-question', question => {
    currentQuestion.value = question
  })

  socket.on('game-results', () => {
    router.push(`/host/${pin}/results`)
  })
})

const nextQuestion = () => {
  socket.emit('next-question', pin)
}
</script>
