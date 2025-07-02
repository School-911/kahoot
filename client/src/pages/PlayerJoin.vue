<template>
  <div class="container mt-5">
    <div class="card shadow p-4 mx-auto" style="max-width: 500px;">
      <h3 class="text-center text-success mb-4">🎮 Tham gia trò chơi</h3>

      <input
        v-model="pin"
        type="text"
        class="form-control mb-3"
        placeholder="🔢 Nhập mã PIN"
      />

      <input
        v-model="name"
        type="text"
        class="form-control mb-4"
        placeholder="🧑 Nhập tên của bạn"
      />

      <button class="btn btn-success w-100" @click="joinGame">
        ✅ Tham gia
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import socket from '../socket'

const pin = ref('')
const name = ref('')
const router = useRouter()

onMounted(() => {
  socket.on('join-success', () => {
    console.log('✅ Tham gia thành công, chuyển đến phòng chờ...')
    router.push(`/lobby/${pin.value}`)
  })

  socket.on('join-failed', () => {
    alert('❌ Mã PIN không hợp lệ')
  })
})

onBeforeUnmount(() => {
  socket.off('join-success')
  socket.off('join-failed')
})

const joinGame = () => {
  if (!pin.value || !name.value) {
    alert('⚠️ Vui lòng nhập đầy đủ mã PIN và tên!')
    return
  }

  console.log(`🚀 Emit join-game:`, { pin: pin.value, name: name.value })
  socket.emit('join-game', { pin: pin.value, name: name.value })
}
</script>
