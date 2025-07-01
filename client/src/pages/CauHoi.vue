<template>
  <div class="question-display" v-if="questions.length">
    <div class="top-bar">
      <div class="timer">⏳ {{ countdown }}s</div>
      <button class="next-btn" @click="nextQuestion" :disabled="isLastQuestion">
        Next
      </button>
    </div>

    <div class="question-area">
      <h2 class="question-text">{{ currentQuestion.text }}</h2>

      <div class="options-grid">
        <div
          v-for="(opt, index) in currentQuestion.options"
          :key="opt._id"
          class="option"
          :style="{ backgroundColor: colors[index] }"
          @click="selectAnswer(opt._id)"
        >
          <span class="shape">{{ shapes[index] }}</span>
          <span class="text">{{ opt.text }}</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading">⏳ Đang tải câu hỏi...</div>
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
  console.log('Chọn đáp án:', index)
}

onMounted(async () => {
  try {
    const res = await axios.get('/api/game-question/ngau-nhien')
    questions.value = res.data.map(q => ({
      text: q.noiDung,
      options: q.luaChon
    }))
    startCountdown()
  } catch (err) {
    console.error('Không lấy được câu hỏi:', err)
  }
})
</script>


<style scoped>
/* giữ nguyên style cũ bạn có */
.question-display {
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
  position: relative;
}
.loading {
  padding: 100px;
  text-align: center;
  font-size: 28px;
}
.top-bar { /* ... */ }
.timer { /* ... */ }
.next-btn { /* ... */ }
.question-area { /* ... */ }
.question-text { /* ... */ }
.options-grid { /* ... */ }
.option { /* ... */ }
.option:hover { /* ... */ }
.shape { /* ... */ }
</style>
