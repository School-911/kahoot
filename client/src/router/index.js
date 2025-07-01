import { createRouter, createWebHistory } from 'vue-router'

import TaoCauHoi from '../pages/admin/TaoCauHoi.vue'
import CauHoi from '../pages/CauHoi.vue'
import SanhChoAdmin from '../pages/SanhChoAdmin.vue'
import ThamGia from '../pages/ThamGia.vue'
import TrangChu2 from '../pages/TrangChu2.vue'
import ViewNguoiChoi from '../pages/ViewNguoiChoi.vue'

const routes = [
  { path: '/', redirect: TrangChu },
  { path: '/taocauhoi', component: TaoCauHoi },
  { path: '/',component : '/trang-chu' },
  { path: '/trang-chu', component: TrangChu2 },
  { path: '/admin/taocauhoi', component: TaoCauHoi },
  { path: '/question/:roomId', component: CauHoi, props: true },
  { path: '/waiting-room/:roomId', component: SanhChoAdmin, props: true },
  { path: '/tham-gia/:roomId', component: ThamGia, props: true },
  { path: '/join-room/:roomId', component: ViewNguoiChoi, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
