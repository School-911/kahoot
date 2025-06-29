<template>
  <div class="container text-center mt-5">
    <h2>Kết quả trò chơi</h2>
    <ul class="list-group w-50 mx-auto">
      <li class="list-group-item" v-for="(p, idx) in players" :key="idx">
        {{ p.name }} - {{ p.score }} điểm
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import socket from '../socket'

const players = ref([])

onMounted(() => {
  socket.on('game-results', (data) => {
    players.value = data
  })
})
</script>
