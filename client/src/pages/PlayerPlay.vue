<template>
  <div class="container text-center mt-5">
    <div class="card shadow p-4 mx-auto" style="max-width: 700px;">
      <h3 class="fw-bold text-dark mb-4">
        {{ question.question || '⏳ Chờ câu hỏi...' }}
      </h3>

      <div class="row">
        <div
          class="col-6 mb-3"
          v-for="(ans, index) in question.answers"
          :key="index"
        >
          <button
            class="btn w-100 py-3 fw-bold text-white"
            :class="answerColors[index % answerColors.length]"
            @click="selectAnswer(index)"
          >
            {{ ans }}
          </button>
        </div>
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

// Màu Bootstrap cho các nút trả lời
const answerColors = ['btn-danger', 'btn-primary', 'btn-success', 'btn-warning']

onMounted(() => {
  socket.on('receive-question', (q) => {
    question.value = q
  })

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
