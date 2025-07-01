<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="h5">⏳ {{ countdown }}s</div>
      <button class="btn btn-primary" @click="nextQuestion" :disabled="isLastQuestion">
        Next
      </button>
    </div>

    <div v-if="questions.length">
      <h2 class="mb-4 text-center">{{ currentQuestion.text }}</h2>

      <div class="row g-3">
        <div
          v-for="(opt, index) in currentQuestion.options"
          :key="index"
          class="col-6"
        >
          <div
            class="card text-white text-center"
            :style="{ backgroundColor: colors[index] }"
            @click="selectAnswer(index)"
            style="cursor: pointer;"
          >
            <div class="card-body">
              <div class="display-6">{{ shapes[index] }}</div>
              <div class="fs-5">{{ opt }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center fs-4 py-5">
      ⏳ Đang tải câu hỏi...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const questions = ref([])
const currentIndex = ref(0)
const countdown = ref(10)
let timer = null

const currentQuestion = computed(() => questions.value[currentIndex.value] || {})
const isLastQuestion = computed(() => currentIndex.value >= questions.value.length - 1)
const shapes = ['▲', '◆', '●', '■']
const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50']

function startCountdown() {
  clearInterval(timer)
  countdown.value = 10
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      nextQuestion()
    }
  }, 1000)
}

function nextQuestion() {
  if (!isLastQuestion.value) {
    currentIndex.value++
    startCountdown()
  }
}

function selectAnswer(index) {
  console.log('Chọn:', index)
}

onMounted(async () => {
  try {
    const res = await axios.get('/api/game-question/ngau-nhien')
    questions.value = res.data.map(q => ({
      text: q.noiDung,
      options: q.luaChon
    }))
    if (questions.value.length > 0) startCountdown()
  } catch {}
})
</script>

<style scoped>
.card-body {
  padding: 1.5rem;
}
</style>
