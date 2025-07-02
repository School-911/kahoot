<template>
  <div class="container text-center mt-5">
    <h2 class="mb-4">{{ question.question }}</h2>

    <div class="row">
      <div
        class="col-6 mb-3"
        v-for="(ans, index) in question.answers"
        :key="index"
      >
        <button
          class="btn w-100 py-3 fw-bold"
          :class="answerColors[index % answerColors.length]"
          @click="selectAnswer(index)"
        >
          {{ ans }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import socket from '../socket'

const route = useRoute()
const router = useRouter()
const pin = route.params.pin
const question = ref({ question: '', answers: [] })

const answerColors = ['btn-danger', 'btn-primary', 'btn-success', 'btn-warning']

// Nhận câu hỏi từ server
onMounted(() => {
  socket.on('receive-question', (q) => {
    question.value = q
  })

  // Nếu trò chơi kết thúc
  socket.on('game-over', () => {
    router.push(`/player/${pin}/results`)
  })
})

onBeforeUnmount(() => {
  socket.off('receive-question')
  socket.off('game-over')
})

const selectAnswer = (answerIndex) => {
  socket.emit('answer-selected', { pin, answerIndex })
}
</script>
