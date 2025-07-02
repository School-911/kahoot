import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import CreateQuiz from '../pages/CreateQuiz.vue'
import PlayerJoin from '../pages/PlayerJoin.vue'
import HostLobby from '../pages/HostLobby.vue'
import HostPlay from '../pages/HostPlay.vue'
import PlayerScreen from '../pages/PlayerScreen.vue'
import ResultPage from '../pages/ResultPage.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Auth from '../pages/Auth.vue'

const routes = [
  { path: '/', redirect: '/auth' },              // ✅ Mặc định chuyển đến /auth
  { path: '/auth', component: Auth },            // Trang chứa nút đăng nhập / đăng ký
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: HomePage },        // ✅ Trang chính sau khi đăng nhập
  { path: '/create', component: CreateQuiz },
  { path: '/join', component: PlayerJoin },
  { path: '/host/:pin', component: HostLobby },
  { path: '/host/:pin/play', component: HostPlay },
  { path: '/host/:pin/results', component: ResultPage },
  { path: '/player/:pin', component: PlayerScreen }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
