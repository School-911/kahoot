<template>
  <div class="container text-center mt-5">
    <h2>{{ currentQuestion.question }}</h2>
    <ul class="list-group w-50 mx-auto">
      <li class="list-group-item" v-for="(ans, idx) in currentQuestion.answers" :key="idx"
          @click="chooseAnswer(idx)">
        {{ ans }}
      </li>
    </ul>
    <p class="mt-3" v-if="result !== null">{{ result ? 'Đúng!' : 'Sai!' }}</p>
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
const name = ref('')

onMounted(() => {
  socket.on('receive-question', question => {
    currentQuestion.value = question
    result.value = null
  })

  socket.on('answer-result', data => {
    result.value = data.isCorrect
  })

  // Nhớ lấy tên từ localStorage nếu bạn muốn lưu tên người chơi
})

const chooseAnswer = (index) => {
  socket.emit('answer', { pin, name: name.value, answerIndex: index })
}
</script>
