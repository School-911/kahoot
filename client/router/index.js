import { createRouter, createWebHistory } from 'vue-router'

import TaoCauHoi from '../pages/admin/TaoCauHoi.vue'
import CauHoi from '../pages/CauHoi.vue'
import SanhChoAdmin from '../pages/SanhChoAdmin.vue'
import ThamGia from '../pages/ThamGia.vue'
import TrangChu2 from '../pages/TrangChu2.vue'
import ViewNguoiChoi from '../pages/ViewNguoiChoi.vue'

const routes = [
  {
    path: '/',
    redirect: '/admin/taocauhoi' // 👉 Tự động vào trang tạo câu hỏi
  },
  {
    path: '/trang-chu',
    name: 'TrangChu',
    component: TrangChu2
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
    component: SanhChoAdmin,
    props: true
  },
  {
    path: '/tham-gia/:roomId', // nên viết thường
    name: 'ThamGia',
    component: ThamGia
  },
  {
    path: '/join-room/:roomId',
    name: 'ViewNguoiChoi',
    component: ViewNguoiChoi,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
