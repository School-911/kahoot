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
import PlayerPlay from '../pages/PlayerPlay.vue'
import ketqua from '../pages/ketqua.vue'

const routes = [
  { path: '/', redirect: '/auth' }, // Trang mặc định
  { path: '/auth', component: Auth },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: HomePage },
  { path: '/create', component: CreateQuiz },
  { path: '/join', component: PlayerJoin },

  // Host flow
  { path: '/host/:pin', component: HostLobby },
  { path: '/host/:pin/play', component: HostPlay },
  { path: '/host/:pin/results', component: ResultPage },

  // Player flow
  { path: '/player/:pin/lobby', component: PlayerScreen },
  { path: '/player/:pin/play', component: PlayerPlay },
  { path: '/player/:pin/results', component: ketqua },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
