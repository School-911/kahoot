<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px;">
      <h3 class="text-center mb-4 text-success">📝 Đăng ký</h3>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <input
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Họ tên"
            required
          />
        </div>
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
        <div class="mb-3">
          <input
            v-model="birthdate"
            type="date"
            class="form-control"
            required
          />
        </div>
        <button type="submit" class="btn btn-success w-100">Đăng ký</button>
      </form>

      <p class="text-center mt-3 mb-0">
        Đã có tài khoản?
        <router-link to="/login" class="text-decoration-none text-primary">
          Đăng nhập
        </router-link>
      </p>
    </div>
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
    await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
      birthdate: birthdate.value.trim()
    })
    alert('Đăng ký thành công!')
    router.push('/login')
  } catch (err) {
    alert(err.response?.data?.message || 'Đăng ký thất bại')
  }
}
</script>
