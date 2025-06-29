<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold mb-6">Đăng nhập</h1>
    <form @submit.prevent="handleLogin" class="w-80 space-y-4">
      <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" class="w-full p-2 border rounded" required />
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded">Đăng nhập</button>
    </form>
    <p class="mt-4">Chưa có tài khoản? <router-link to="/register" class="text-blue-500">Đăng ký</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { user } from '../stores/auth' // Nếu bạn có store để lưu user toàn cục

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
      email: email.value,
      password: password.value
    })

    if (response.data.success) {
      alert('Đăng nhập thành công!')

      // ✅ Lưu user vào localStorage và store (nếu có)
      const userData = {
        name: response.data.name || 'Người dùng'
      }
      localStorage.setItem('user', JSON.stringify(userData))
      user.value = userData  // Nếu bạn dùng Pinia hoặc store đơn giản

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

<style scoped>
input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>
