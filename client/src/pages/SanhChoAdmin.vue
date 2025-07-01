<template>
  <div class="container py-4">
    <!-- Game PIN -->
    <div class="row mb-4">
      <div class="col text-center">
        <h4 class="fw-bold">Game PIN</h4>
        <div class="fs-3 text-primary">{{ roomId }}</div>
      </div>
    </div>

    <!-- Tiêu đề + danh sách người chơi -->
    <div class="row">
      <div class="col-12 text-center mb-4">
        <h1 class="display-4 fw-bold">Kahoot!</h1>
      </div>

      <div class="col-12 d-flex flex-wrap justify-content-center gap-3">
        <div
          v-for="(player, index) in players"
          :key="index"
          class="card text-center"
          style="width: 150px;"
        >
          <img
            :src="player.avatar || 'https://via.placeholder.com/150'"
            alt="avatar"
            class="card-img-top"
            style="height: 120px; object-fit: cover;"
          />
          <div class="card-body p-2">
            <p class="card-text text-truncate mb-0">{{ player.name || 'Ẩn danh' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Nút Start -->
    <div class="row mt-5">
      <div class="col text-center">
        <button class="btn btn-success btn-lg" @click="startGame">
          🚀 Bắt đầu
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useSocket } from '@/composables/useSocket'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const roomId = ref(route.params.roomId || '')
const players = ref([])

const socket = useSocket()
const playerId = 'player_' + Math.random().toString(36).substring(2, 10)
const playerName = ref('Ẩn danh')
const avatar = ref('')

function handleRoomUpdate(room) {
  players.value = room?.players || []
}

async function startGame() {
  try {
    const res = await axios.get('/api/game-question/random')
    const danhSachCauHoi = Array.isArray(res.data) ? res.data : []

    if (!danhSachCauHoi.length) {
      alert('Không có câu hỏi!')
      return
    }

    socket.emit('start-game', {
      roomId: roomId.value,
      playerId,
      questions: danhSachCauHoi
    })

    router.push(`/question/${roomId.value}`)
  } catch (err) {
    alert('Không thể bắt đầu!')
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const nav = performance.getEntriesByType('navigation')[0]
    if (nav && nav.type === 'reload') {
      window.location.href = '/'
      return
    }
  }

  socket.emit('join-room', {
    roomId: roomId.value,
    player: {
      id: playerId,
      name: playerName.value,
      avatar: avatar.value
    }
  })

  socket.on('room-updated', handleRoomUpdate)
})

onBeforeUnmount(() => {
  socket.off('room-updated', handleRoomUpdate)
})
</script>
