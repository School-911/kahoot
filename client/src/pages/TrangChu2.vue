<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
    <h1 class="display-4 fw-bold text-primary mb-4">Kahoot - Trang chủ</h1>
    <button class="btn btn-primary btn-lg" @click="createRoom">
      ➕ Tạo phòng
    </button>
  </div>
</template>

<script setup>
console.log('TrangChu2 mounted')
import { useRouter } from 'vue-router'

const router = useRouter()

function generateRoomId() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function createRoom() {
  const roomId = generateRoomId()
  router.push(`/waiting-room/${roomId}`)
}
</script>
