<template>
  <div class="text-center mt-5">
    <h2>Mã PIN: {{ pin }}</h2>
    <p>Người chơi đã tham gia:</p>
    <ul class="list-group w-50 mx-auto">
      <li class="list-group-item" v-for="(name, index) in players" :key="index">{{ name }}</li>
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
  socket.on('player-joined', name => {
    players.value.push(name)
  })
})

const startGame = () => {
  socket.emit('start-game', { pin })
  router.push(`/host/${pin}/play`)
}
</script>
