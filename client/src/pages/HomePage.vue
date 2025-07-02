<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
    <div class="card shadow p-4" style="width: 100%; max-width: 500px">
      <h1 class="display-5 fw-bold text-primary mb-4">Kahoot Clone</h1>

      <router-link to="/create" class="btn btn-primary btn-lg w-100 mb-3">
        ➕ Tạo câu hỏi
      </router-link>

      <router-link to="/join" class="btn btn-success btn-lg w-100 mb-4">
        🎮 Tham gia
      </router-link>

      <input
        v-model="pinInput"
        class="form-control mb-2"
        placeholder="🔍 Nhập mã PIN để xem lại quiz"
      />
      <button class="btn btn-outline-secondary w-100" @click="getQuiz">
        Xem lại quiz cũ
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const pinInput = ref('')

const getQuiz = async () => {
  if (!pinInput.value) return alert('Vui lòng nhập mã PIN')

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/rooms/${pinInput.value}/quiz`
    )
    alert(`Quiz có ${res.data.questions.length} câu hỏi!`)
    console.log('✅ Quiz:', res.data)

    // 👉 Bạn có thể lưu vào localStorage để sử dụng lại
    localStorage.setItem('quiz_preview', JSON.stringify(res.data))
  } catch (err) {
    console.error(err)
    alert('❌ Không tìm thấy quiz với mã PIN này.')
  }
}
</script>
