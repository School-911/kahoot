<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4 w-100" style="max-width: 400px">
      <h2 class="text-center mb-4 text-primary">
        {{ isLogin ? '🔐 Đăng nhập' : '✍️ Đăng ký' }}
      </h2>

      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="mb-3">
          <label class="form-label">Tên người dùng</label>
          <input v-model="form.name" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input v-model="form.password" type="password" class="form-control" required />
        </div>

        <button class="btn btn-primary w-100 mb-3">
          {{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}
        </button>
      </form>

      <p class="text-center text-muted">
        {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
        <button class="btn btn-link p-0" @click="toggleForm">
          {{ isLogin ? 'Đăng ký' : 'Đăng nhập' }}
        </button>
      </p>

      <!-- ✅ Thông báo chào mừng -->
      <div v-if="welcomeMessage" class="alert alert-success text-center mt-3" role="alert">
        🎉 {{ welcomeMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, user } from '../stores/auth' // Đảm bảo đã có auth.js
import axios from 'axios'

const router = useRouter()
const isLogin = ref(true)

const form = ref({
  name: '',
  email: '',
  password: ''
})

const welcomeMessage = ref('')

const toggleForm = () => {
  isLogin.value = !isLogin.value
  form.value = { name: '', email: '', password: '' }
  welcomeMessage.value = ''
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      // Gọi API đăng nhập
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        email: form.value.email.trim(),
        password: form.value.password.trim()
      })

      const userData = {
        name: res.data.name || 'Người dùng'
      }

      login(userData)
      welcomeMessage.value = `Chào mừng đến với Kahoot FA Kè, ${userData.name}!`
      setTimeout(() => router.push('/home'), 1500)

    } else {
      // Gọi API đăng ký
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        password: form.value.password.trim(),
        birthdate: new Date().toISOString() // Hoặc thêm ô chọn ngày sinh
      })

      welcomeMessage.value = '🎉 Đăng ký thành công! Hãy đăng nhập.'
      isLogin.value = true
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Lỗi kết nối máy chủ!')
  }
}
</script>
