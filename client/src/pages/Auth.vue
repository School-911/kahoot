<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4 w-100" style="max-width: 400px">
      <h2 class="text-center mb-4 text-primary">{{ isLogin ? '🔐 Đăng nhập' : '✍️ Đăng ký' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
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
        <button class="btn btn-link p-0" @click="isLogin = !isLogin">
          {{ isLogin ? 'Đăng ký' : 'Đăng nhập' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)

const form = ref({
  name: '',
  email: '',
  password: ''
})

const handleSubmit = () => {
  // Với mục đích demo, bạn có thể thay phần này bằng gọi API sau
  const newUser = {
    name: form.value.name,
    email: form.value.email
  }

  login(newUser) // từ auth.js
  router.push('/') // chuyển về trang chủ sau đăng nhập
}
</script>
