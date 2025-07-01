// client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import TaoCauHoi from '../pages/admin/TaoCauHoi.vue'
import Cauhoi from '../pages/CauHoi.vue'
import Sanhchoadmin from '../pages/SanhChoAdmin.vue'
import Thamgia from '../pages/ThamGia.vue'
import Trangchu2 from '../pages/TrangChu2.vue'
import Viewnguoichoi from '../pages/ViewNguoiChoi.vue'

const routes = [
  {
    path: '/',
    redirect: '/trang-chu' // 👉 Tự động về trang chủ
  },
  {
    path: '/trang-chu',
    name: 'TrangChu',
    component: Trangchu2
  },
  {
    path: '/admin/taocauhoi',
    name: 'TaoCauHoi',
    component: TaoCauHoi
  },
  {
    path: '/question/:roomId',
    name: 'Cauhoi',
    component: CauHoi,
    props: true
  },
  {
    path: '/waiting-room/:roomId',
    name: 'SanhChoAdmin',
    component: Sanhchoadmin,
    props: true
  },
  {
    path: '/Tham-gia/:roomId',
    name: 'ThamGia',
    component: Thamgia
  },
  {
    path: '/join-room/:roomId',
    name: 'ViewNguoiChoi',
    component: Viewnguoichoi,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
