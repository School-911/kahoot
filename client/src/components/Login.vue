<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 350px;">
      <h3 class="text-center mb-4 text-primary">🔐 Đăng nhập</h3>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Email"
            required
          />
        </div>
        <div class="mb-3">
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Mật khẩu"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
      </form>

      <p class="text-center mt-3 mb-0">
        Chưa có tài khoản?
        <router-link to="/register" class="text-decoration-none text-success">
          Đăng ký
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { user } from '../stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
      email: email.value.trim(),
      password: password.value.trim()
    })

    if (response.data.success) {
      alert('Đăng nhập thành công!')
      const userData = { name: response.data.name || 'Người dùng' }
      localStorage.setItem('user', JSON.stringify(userData))
      user.value = userData
      router.push('/home')
    } else {
      alert('Sai email hoặc mật khẩu')
    }
  } catch (error) {
    alert('Lỗi server')
    console.error(error)
  }
}
</script>
