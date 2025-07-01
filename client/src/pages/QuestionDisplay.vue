<template>
  <div class="question-display">
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
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const roomId = ref(route.params.roomId || '------')

const questions = [
  {
    text: 'Ai là người sáng lập Apple?',
    options: [
      { _id: 'a1', text: 'Bill Gates' },
      { _id: 'a2', text: 'Steve Jobs' },
      { _id: 'a3', text: 'Elon Musk' },
      { _id: 'a4', text: 'Mark Zuckerberg' }
    ]
  },
  {
    text: 'Ngôn ngữ lập trình nào chạy trên trình duyệt?',
    options: [
      { _id: 'b1', text: 'C++' },
      { _id: 'b2', text: 'Python' },
      { _id: 'b3', text: 'JavaScript' },
      { _id: 'b4', text: 'Java' }
    ]
  }
]

const currentIndex = ref(0)
const currentQuestion = computed(() => questions[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value >= questions.length - 1)

const shapes = ['▲', '◆', '●', '■']
const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50']

const countdown = ref(10)
let timer = null

function startCountdown() {
  clearInterval(timer)
  countdown.value = 10
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
      nextQuestion()
    }
  }, 1000)
}

function selectAnswer(answerId) {
  console.log('Selected:', answerId)
}

function nextQuestion() {
  if (!isLastQuestion.value) {
    currentIndex.value++
  }
}

watch(currentIndex, () => {
  startCountdown()
})

onMounted(() => {
  startCountdown()
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.question-display {
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
  position: relative;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.timer {
  font-size: 26px;
  font-weight: bold;
  color: #4a148c;
  background: white;
  padding: 10px 18px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.next-btn {
  background-color: #4a148c;
  color: white;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.next-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.question-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.question-text {
  font-size: 32px;
  color: #4a148c;
  text-align: center;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 300px);
  grid-gap: 40px;
}

.option {
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
  padding: 25px 30px;
  border-radius: 18px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
}

.option:hover {
  transform: scale(1.07);
}

.shape {
  font-size: 36px;
}
</style>