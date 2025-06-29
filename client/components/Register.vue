<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold mb-6">Đăng ký</h1>
    <form @submit.prevent="handleRegister" class="w-80 space-y-4">
      <input v-model="name" type="text" placeholder="Họ tên" class="w-full p-2 border rounded" required />
      <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" class="w-full p-2 border rounded" required />
      <input v-model="birthdate" type="date" placeholder="Ngày sinh" class="w-full p-2 border rounded" required />
      <button type="submit" class="w-full bg-green-500 text-white py-2 rounded">Đăng ký</button>
    </form>
    <p class="mt-4">Đã có tài khoản? <router-link to="/login" class="text-blue-500">Đăng nhập</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const name = ref('')
const email = ref('')
const password = ref('')
const birthdate = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/Register`, {
      name: name.value,
      email: email.value,
      password: password.value,
      birthdate: birthdate.value
    })
    alert('Đăng ký thành công!')
    router.push('/login')
  } catch (err) {
    alert(err.response?.data?.message || 'Đăng ký thất bại')
  }
}
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: #10b981;
}
</style>