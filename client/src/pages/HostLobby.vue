<template>
  <div class="container mt-5">
    <div class="card shadow p-4 mx-auto" style="max-width: 500px;">
      <h2 class="text-center text-primary mb-3">🎯 Mã PIN: <span class="text-dark">{{ pin }}</span></h2>

      <h5 class="text-center text-muted mb-3">Người chơi đã tham gia:</h5>

      <ul class="list-group mb-3">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="(player, index) in players"
          :key="index"
        >
          <span>👤 {{ player.name }}</span>
        </li>
      </ul>

      <button class="btn btn-primary w-100" @click="startGame">
        🚀 Bắt đầu trò chơi
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import socket from '../socket'

const route = useRoute()
const router = useRouter()
const pin = route.params.pin
const players = ref([])

onMounted(() => {
  socket.emit('get-players', pin)

  socket.on('player-joined', (name) => {
    players.value.push({ name })
  })

  socket.on('player-list', (list) => {
    players.value = list.map(p => ({ name: p.name }))
  })
})

onBeforeUnmount(() => {
  socket.off('player-joined')
  socket.off('player-list')
})

const startGame = () => {
  socket.emit('start-game', { pin })
  router.push(`/host/${pin}/play`)
}
</script>
