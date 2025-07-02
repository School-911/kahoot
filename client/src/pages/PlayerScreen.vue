<template>
  <div class="container text-center mt-5">
    <div class="card shadow p-4 mx-auto" style="max-width: 700px;">
      <h3 class="fw-bold text-dark mb-4">
        {{ currentQuestion.question || '⏳ Chờ câu hỏi...' }}
      </h3>

      <ul class="list-group w-75 mx-auto">
        <li
          class="list-group-item list-group-item-action fw-semibold"
          v-for="(ans, idx) in currentQuestion.answers"
          :key="idx"
          :class="getAnswerClass(idx)"
          @click="chooseAnswer(idx)"
          style="cursor: pointer"
        >
          {{ ans }}
        </li>
      </ul>

      <p class="mt-4 fs-5" v-if="result !== null">
        <span v-if="result" class="text-success fw-bold">✅ Đúng!</span>
        <span v-else class="text-danger fw-bold">❌ Sai!</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import socket from '../socket'

const route = useRoute()
const pin = route.params.pin
const currentQuestion = ref({ question: '', answers: [] })
const result = ref(null)
const selectedIndex = ref(null)
const name = ref(localStorage.getItem('name') || '') // bạn có thể lưu name trong localStorage khi join game

onMounted(() => {
  socket.on('receive-question', question => {
    currentQuestion.value = question
    result.value = null
    selectedIndex.value = null
  })

  socket.on('answer-result', data => {
    result.value = data.isCorrect
  })
})

const chooseAnswer = (index) => {
  if (selectedIndex.value !== null) return // tránh chọn nhiều lần
  selectedIndex.value = index
  socket.emit('answer', {
    pin,
    name: name.value,
    answerIndex: index
  })
}

const getAnswerClass = (idx) => {
  if (selectedIndex.value === null) return ''
  if (idx !== selectedIndex.value) return 'disabled'
  return result.value ? 'bg-success text-white' : 'bg-danger text-white'
}
</script>
