import { createRouter, createWebHistory } from 'vue-router'

// Các trang (component)
import TaoCauHoi from '../pages/admin/TaoCauHoi.vue'
import CauHoi from '../pages/CauHoi.vue'
import SanhChoAdmin from '../pages/SanhChoAdmin.vue'
import ThamGia from '../pages/ThamGia.vue'
import TrangChu2 from '../pages/TrangChu2.vue'
import ViewNguoiChoi from '../pages/ViewNguoiChoi.vue'

const routes = [
  // ✅ Redirect mặc định
  {
    path: '/',
    redirect: '/trang-chu'
  },

  // ✅ Trang chủ
  {
    path: '/trang-chu',
    name: 'TrangChu',
    component: TrangChu2
  },

  // ✅ Tạo câu hỏi (admin)
  {
    path: '/admin/taocauhoi',
    name: 'TaoCauHoi',
    component: TaoCauHoi
  },

  // ✅ Trang hiển thị câu hỏi cho host
  {
    path: '/question/:roomId',
    name: 'Cauhoi',
    component: CauHoi,
    props: true
  },

  // ✅ Phòng chờ admin
  {
    path: '/waiting-room/:roomId',
    name: 'SanhChoAdmin',
    component: SanhChoAdmin,
    props: true
  },

  // ✅ Người chơi nhập tên và tham gia
  {
    path: '/tham-gia/:roomId',
    name: 'ThamGia',
    component: ThamGia,
    props: true
  },

  // ✅ View người chơi trong phòng (host xem)
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
