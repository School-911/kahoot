<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
    <!-- Thanh điều hướng -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm w-100 px-4">
      <a class="navbar-brand fw-bold text-primary">🎯 Kahoot FA Kè</a>
      <div class="ms-auto">
        <router-link to="/login" class="btn btn-outline-primary mx-2">Đăng nhập</router-link>
        <router-link to="/register" class="btn btn-outline-success mx-2">Đăng ký</router-link>
      </div>
    </nav>

    <!-- Nội dung chào mừng -->
    <div class="text-center mt-5">
      <h1 class="display-5 fw-bold text-dark">🎉 Chào mừng đến với Kahoot FA Kè</h1>
      <p class="text-secondary mt-3 fs-5">Tham gia - Thi đấu - Thử thách cùng bạn bè!</p>
    </div>
  </div>
</template>

<script setup>
// Không cần logic nào ở đây
</script>
