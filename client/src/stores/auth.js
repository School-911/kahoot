import { ref } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)

function login(newUser) {
  user.value = newUser
  localStorage.setItem('user', JSON.stringify(newUser))
}

function logout() {
  user.value = null
  localStorage.removeItem('user')
}

export { user, login, logout }
