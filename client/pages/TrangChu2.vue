<!-- client/src/pages/Trangchu2.vue -->
<template>
  <div class="host-home">
    <h1 class="title">Kahoot - Trang chủ</h1>
    <button class="btn" @click="createRoom">Tạo phòng</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function generateRoomId() {
  // Sinh mã PIN gồm 6 số
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function createRoom() {
  const roomId = generateRoomId()
  router.push(`/waiting-room/${roomId}`) // chuyển tới trang sảnh chờ admin
}
</script>

<style scoped>
.host-home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  font-family: 'Segoe UI', sans-serif;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #4a148c;
}

.btn {
  background-color: #4a148c;
  color: white;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}
.btn:hover {
  transform: scale(1.05);
}
</style>
