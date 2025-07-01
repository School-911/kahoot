<template>
  <div class="lobby">
    <div class="top-bar">
      <div class="game-pin">
        Game PIN:<br />
        <span class="pin"><strong>{{ roomId }}</strong></span>
      </div>
    </div>

    <div class="screen">
      <h1 class="title">Kahoot!</h1>
      <div v-for="(player, index) in players" :key="index" class="player-box">
        <img class="avatar" :src="player.avatar" alt="avatar" />
        <span class="player-name">{{ player.name }}</span>
      </div>
    </div>

    <div class="right-panel">
      <button class="start-btn" @click="startGame">
        <span class="icon">🚀</span> Start
      </button>
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
const roomId = ref(route.params.roomId)
const players = ref([])

const socket = useSocket()

// fake dữ liệu tạm cho người chơi
const playerId = 'player_' + Math.random().toString(36).substring(2, 10)
const playerName = ref('Người chơi ẩn danh')
const avatar = ref('')

// Handler cập nhật room
function handleRoomUpdate(room) {
  players.value = room.players || []
}

async function startGame() {
  try {
    const res = await axios.get('/api/game-question/random')
    const danhSachCauHoi = res.data || []

    socket.emit('start-game', {
      roomId: roomId.value,
      playerId,
      questions: danhSachCauHoi
    })

    router.push(`/question/${roomId.value}`)
  } catch (err) {
    console.error('Lỗi khi lấy câu hỏi:', err)
    alert('Không thể bắt đầu vì không có câu hỏi!')
  }
}

onMounted(() => {
  // nếu user reload thì về lại trang chủ
  if (performance.getEntriesByType('navigation')[0].type === 'reload') {
    window.location.href = '/'
    return
  }

  // Tham gia room
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
