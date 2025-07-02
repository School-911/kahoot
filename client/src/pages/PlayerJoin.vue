<template>
  <div class="container mt-5">
    <h2>Tham gia trò chơi</h2>
    <input v-model="pin" class="form-control mb-2" placeholder="Mã PIN" />
    <input v-model="name" class="form-control mb-2" placeholder="Tên của bạn" />
    <button class="btn btn-success" @click="joinGame">Tham gia</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import socket from '../socket'

const pin = ref('')
const name = ref('')
const router = useRouter()

// Đăng ký các socket listener một lần
onMounted(() => {
  socket.on('join-success', () => {
    console.log('✅ Tham gia thành công, chuyển đến phòng chờ...')
    router.push(`/lobby/${pin.value}`) // 👉 chuyển đến trang lobby
  })

  socket.on('join-failed', () => {
    alert('❌ Mã PIN không hợp lệ')
  })
})

// Dọn dẹp khi rời trang
onBeforeUnmount(() => {
  socket.off('join-success')
  socket.off('join-failed')
})

const joinGame = () => {
  if (!pin.value || !name.value) {
    alert('Vui lòng nhập đầy đủ mã PIN và tên!')
    return
  }

  console.log(`🚀 Emit join-game:`, { pin: pin.value, name: name.value })
  socket.emit('join-game', { pin: pin.value, name: name.value })
}
</script>
