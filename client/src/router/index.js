// client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import TaoCauHoi from '../pages/admin/taocauhoi.vue'
import PlayGame from '../pages/QuestionDisplay.vue'

const routes = [
  {
    path: '/',
    redirect: '/QuestionDisplay' // Nếu muốn trang chủ tự động chuyển đến
  },
  {
    path: '/admin/taocauhoi',
    name: 'TaoCauHoi',
    component: TaoCauHoi
  },
  {
    path: '/choi/',           // ✅ thêm route mới
    name: 'QuestionDisplay',
    component: QuestionDisplay
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
