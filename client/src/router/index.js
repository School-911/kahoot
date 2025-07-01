// client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import TaoCauHoi from '../pages/admin/taocauhoi.vue'

const routes = [
  {
    path: '/',
    redirect: '/admin/taocauhoi' // Nếu muốn trang chủ tự động chuyển đến
  },
  {
    path: '/admin/taocauhoi',
    name: 'TaoCauHoi',
    component: TaoCauHoi
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
