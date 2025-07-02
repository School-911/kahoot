<template>
  <div>
    <!-- Navbar -->
    <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-light px-3">
      <a class="navbar-brand" href="#">🎯 Kahoot Clone</a>
      <div class="ml-auto">
        👤 {{ user.name }}
        <button class="btn btn-sm btn-outline-danger ml-2" @click="logoutUser">Đăng xuất</button>
      </div>
    </nav>

    <!-- Nếu chưa đăng nhập, hiện login/register -->
    <nav v-else class="navbar navbar-expand-lg navbar-light bg-light px-3">
      <a class="navbar-brand" href="#">🎯 Kahoot Clone</a>
      <div class="ml-auto">
        <router-link to="/login" class="btn btn-sm btn-outline-primary mx-1">Đăng nhập</router-link>
        <router-link to="/register" class="btn btn-sm btn-outline-success mx-1">Đăng ký</router-link>
      </div>
    </nav>

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
  font-family: sans-serif;
}
</style>
