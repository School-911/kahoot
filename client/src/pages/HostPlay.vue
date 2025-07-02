<template>
  <div class="container mt-5 text-center">
    <h3 class="mb-4">Danh sách câu hỏi</h3>
    <ul class="list-group w-75 mx-auto">
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-for="(q, index) in questions"
        :key="index"
      >
        {{ index + 1 }}. {{ q.question }}
        <button class="btn btn-primary btn-sm" @click="sendQuestion(index)">
          ▶️ Chiếu
        </button>
      </li>
    </ul>

    <button class="btn btn-danger mt-4" @click="endGame">
      ⛔ Kết thúc trò chơi
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import socket from '../socket'

const route = useRoute()
const pin = route.params.pin
const questions = ref([])

onMounted(() => {
  socket.emit('get-questions', pin)
  socket.on('question-list', (qs) => {
    questions.value = qs
  })
})

const sendQuestion = (index) => {
  socket.emit('select-question', { pin, index })
}

const endGame = () => {
  socket.emit('end-game', pin)
}
</script>
