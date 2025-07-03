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
import { useRoute, useRouter } from 'vue-router'
import socket from '../socket'

const route = useRoute()
const router = useRouter()
const pin = route.params.pin
const questions = ref([])

onMounted(() => {
  // ✅ Quan trọng: bắt buộc phải gọi lại host-join nếu reload trang
  socket.emit('host-join', pin)

  socket.emit('get-questions', pin)
  socket.on('question-list', (qs) => {
    questions.value = qs
  })

  // Optional: lắng nghe phản hồi khi chiếu
  socket.on('receive-question', (data) => {
    console.log('📥 Câu hỏi đã được chiếu:', data)
  })
})

const sendQuestion = (index) => {
  console.log('📤 Chiếu câu hỏi index', index)
  socket.emit('select-question', { pin, index })
}

const endGame = () => {
  console.log('🛑 Emit end-game')
  socket.emit('end-game', pin)
  router.push(`/host/${pin}/results`)
}
</script>
