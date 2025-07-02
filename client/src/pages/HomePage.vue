<template>
  <div class="text-center mt-5">
    <h1 class="text-3xl font-bold mb-4">Kahoot Clone</h1>
    <router-link to="/create" class="btn btn-primary m-2">Tạo câu hỏi</router-link>
    <router-link to="/join" class="btn btn-success m-2">Tham gia</router-link>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCreate = () => {
  router.push('/create')
}

const goToJoin = () => {
  router.push('/player')
}
</script>
