<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <a class="navbar-brand fw-bold text-primary fs-4" href="#">🎯 Kahoot Clone</a>

        <div class="d-flex align-items-center">
          <template v-if="isLoggedIn">
            <span class="me-3">👤 <strong>{{ user.name }}</strong></span>
            <button class="btn btn-outline-danger btn-sm" @click="logoutUser">Đăng xuất</button>
          </template>

          <template v-else>
            <router-link to="/login" class="btn btn-outline-primary btn-sm me-2">Đăng nhập</router-link>
            <router-link to="/register" class="btn btn-outline-success btn-sm">Đăng ký</router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- Nội dung -->
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { user, logout } from './stores/auth'

const router = useRouter()
const route = useRoute()

// Kiểm tra đã đăng nhập chưa
const isLoggedIn = computed(() => !!user.value?.name)

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (!userData && route.path !== '/auth') {
    router.replace('/auth') // Chưa đăng nhập thì về trang auth
  } else if (userData && route.path === '/auth') {
    router.replace('/home') // Đã đăng nhập thì về trang chủ
  }
})

const logoutUser = () => {
  logout()
  localStorage.removeItem('user')
  router.push('/auth')
}
</script>

<style>
body {
  margin: 0;
  font-family: "Segoe UI", Roboto, sans-serif;
  background-color: #f8f9fa;
}
</style>
