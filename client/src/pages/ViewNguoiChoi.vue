<template>
  <div class="d-flex flex-column justify-content-between align-items-center min-vh-100 py-5 bg-light position-relative">
    <!-- Game PIN -->
    <div class="bg-white px-4 py-2 rounded shadow text-center position-absolute top-0 start-50 translate-middle-x mt-4">
      <div class="fw-bold text-secondary">Game PIN</div>
      <div class="fs-3 text-primary">{{ roomId }}</div>
    </div>

    <!-- Main content -->
    <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
      <h1 class="display-5 fw-bold mb-4 text-dark">Đang chờ bắt đầu...</h1>

      <div class="bg-primary text-white px-4 py-3 rounded shadow d-flex align-items-center gap-3">
        <div class="fs-4 fw-bold">{{ player.name }}</div>
      </div>
    </div>

    <!-- Bottom controls -->
    <div class="d-flex gap-4 fs-4 text-muted mb-3">
      <span title="Âm lượng">🔊</span>
      <span title="Cài đặt">⚙️</span>
      <span title="Toàn màn hình">⛶</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSocket } from '@/composables/useSocket'

const route = useRoute()
const socket = useSocket()

const roomId = ref(route.params.roomId)
const player = ref({
  id: socket.id,
  name: ''
})

onMounted(() => {
  const storedName = localStorage.getItem('playerName') || 'Người chơi ẩn danh'
  player.value.name = storedName

  socket.emit('join-room', {
    roomId: roomId.value,
    player: {
      id: player.value.id,
      name: player.value.name
    }
  })
})
</script>
