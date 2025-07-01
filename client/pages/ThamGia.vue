<template>
  <div class="enter-code">
    <h2>Nhập mã phòng</h2>
    <input v-model="roomCode" placeholder="Nhập mã phòng..." />
    <input v-model="playerName" placeholder="Tên người chơi..." />
    <button @click="joinRoom">Vào phòng</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSocket } from '@/composables/useSocket'

const router = useRouter()
const socket = useSocket()

const roomCode = ref('')
const playerName = ref('')

function generatePlayerId() {
  return 'player_' + Math.random().toString(36).substr(2, 9)
}

function joinRoom() {
  const playerId = generatePlayerId()

  const player = {
    id: playerId,
    name: playerName.value || 'Người chơi ẩn danh',
    avatar: '' // Bạn có thể thêm tính năng chọn avatar sau
  }

  // Lưu vào localStorage để dùng ở trang chờ
  localStorage.setItem('playerName', player.name)
  localStorage.setItem('playerId', player.id)
  localStorage.setItem('playerAvatar', player.avatar)

  // Gửi thông tin join-room
  socket.emit('join-room', {
    roomId: roomCode.value,
    player
  })

  // Lắng nghe phản hồi để vào phòng
  socket.once('room-updated', () => {
    router.push(`/join-room/${roomCode.value}`)
  })

  socket.once('error', (msg) => {
    alert(msg || 'Không thể vào phòng')
  })
}
</script>

<style scoped>
.enter-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  font-family: 'Segoe UI', sans-serif;
}

.enter-code h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #4a148c;
}

.enter-code input {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 250px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.enter-code button {
  background-color: #4a148c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform 0.1s ease;
}

.enter-code button:hover {
  transform: scale(1.05);
}
</style>
