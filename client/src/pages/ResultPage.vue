<template>
  <div class="container mt-5 text-center">
    <h2 class="fw-bold text-dark mb-4">🎉 Trò chơi kết thúc!</h2>
    <h4 class="text-secondary mb-4">📊 Kết quả người chơi</h4>

    <div class="table-responsive">
      <table class="table table-bordered shadow-sm rounded bg-white w-75 mx-auto">
        <thead class="table-light">
          <tr class="text-center">
            <th>#</th>
            <th>Tên</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in players" :key="index" class="text-center">
            <td class="fw-bold">{{ index + 1 }}</td>
            <td>{{ player.name }}</td>
            <td>{{ player.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link to="/HomePage" class="btn btn-success mt-4">
      🔁 Chơi lại
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import socket from '../socket'

const players = ref([])

onMounted(() => {
  socket.on('game-results', (data) => {
    // Sắp xếp theo điểm cao nhất
    players.value = [...data].sort((a, b) => b.score - a.score)
  })
})
</script>
