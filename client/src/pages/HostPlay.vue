<template>
  <div class="text-center mt-5">
    <h2>{{ currentQuestion.question }}</h2>
    <ul class="list-group w-50 mx-auto">
      <li class="list-group-item" v-for="(ans, idx) in currentQuestion.answers" :key="idx">
        {{ ans }}
      </li>
    </ul>
    <button class="btn btn-secondary mt-3" @click="nextQuestion">Câu tiếp theo</button>
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
