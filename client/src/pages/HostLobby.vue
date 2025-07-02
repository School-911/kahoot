<template>
  <div class="text-center mt-5">
    <h2>Mã PIN: {{ pin }}</h2>
    <p>Người chơi đã tham gia:</p>
    <ul class="list-group w-50 mx-auto">
      <li class="list-group-item" v-for="(player, index) in players" :key="index">
        {{ player }}
      </li>
    </ul>
    <button class="btn btn-primary mt-3" @click="startGame">Bắt đầu</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import socket from '../socket'

const route = useRoute()
const router = useRouter()
const pin = route.params.pin
const players = ref([])

onMounted(() => {
  socket.emit('get-players', pin) // Khi vào lobby, yêu cầu danh sách player

  socket.on('player-joined', name => {
    players.value.push(name)
  })

  socket.on('player-list', list => {
    players.value = list.map(p => p.name)
  })
})

const startGame = () => {
  socket.emit('start-game', { pin })
  router.push(`/host/${pin}/play`)
}
</script>
