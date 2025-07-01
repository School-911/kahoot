<template>
  <div class="lobby">
    <div class="top-bar">
      <div class="game-pin">
        Game PIN:<br />
        <span class="pin"><strong>{{ roomId }}</strong></span>
      </div>
    </div>

    <div class="screen">
      <h1 class="title">Đang chờ bắt đầu...</h1>
      <div class="player-box">
        <span class="player-name">{{ player.name }}</span>
      </div>
    </div>

    <div class="bottom-bar">
      <span class="volume">🔊</span>
      <span class="settings">⚙️</span>
      <span class="fullscreen">⛶</span>
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

  // Gửi join-room
  socket.emit('join-room', {
    roomId: roomId.value,
    player: {
      id: player.value.id,
      name: player.value.name
    }
  })
})
</script>

<style scoped>
.lobby {
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  font-family: sans-serif;
  position: relative;
  min-height: 100vh;
  margin-top: -100px;
}

.top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  font-size: 16px;
  z-index: 100;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
  width: 200px;
}

.game-pin {
  text-align: center;
  font-size: 20px;
}

.pin {
  font-size: 36px;
  font-weight: bold;
}

.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  margin-top: 100px;
  gap: 20px;
}

.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: white;
  text-shadow: 2px 2px 4px #000;
}

.player-box {
  display: flex;
  align-items: center;
  background: #4a148c;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  gap: 10px;
}

.player-name {
  font-size: 24px;
  font-weight: bold;
}

.bottom-bar {
  position: absolute;
  bottom: 20px;
  right: 30px;
  display: flex;
  gap: 20px;
  font-size: 20px;
}
</style>
