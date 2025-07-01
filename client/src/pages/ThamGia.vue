<template>
  <div class="container d-flex flex-column justify-content-center align-items-center vh-100">
    <div class="text-center mb-4">
      <h2 class="fw-bold text-primary">Nhập mã phòng</h2>
    </div>

    <div class="w-100" style="max-width: 400px;">
      <div class="mb-3">
        <input
          v-model="roomCode"
          type="text"
          class="form-control form-control-lg"
          placeholder="Nhập mã phòng..."
        />
      </div>

      <div class="mb-4">
        <input
          v-model="playerName"
          type="text"
          class="form-control form-control-lg"
          placeholder="Tên người chơi..."
        />
      </div>

      <div class="text-center">
        <button class="btn btn-success btn-lg w-100" @click="joinRoom">
          🎮 Vào phòng
        </button>
      </div>
    </div>
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
    avatar: '' // có thể thêm sau
  }

  localStorage.setItem('playerName', player.name)
  localStorage.setItem('playerId', player.id)
  localStorage.setItem('playerAvatar', player.avatar)

  socket.emit('join-room', {
    roomId: roomCode.value,
    player
  })

  socket.once('room-updated', () => {
    router.push(`/join-room/${roomCode.value}`)
  })

  socket.once('error', (msg) => {
    alert(msg || 'Không thể vào phòng')
  })
}
</script>
