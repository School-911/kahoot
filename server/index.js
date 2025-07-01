// File: client/src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')


// File: client/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kahoot Clone</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>


// File: client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import TrangChu from '@/pages/Trangchu2.vue'
import TaoCauHoi from '@/pages/taocauhoi.vue'

const routes = [
  { path: '/', component: TrangChu },
  { path: '/taocauhoi', component: TaoCauHoi }
]

export default createRouter({
  history: createWebHistory(),
  routes
})


// File: server/index.js
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import cauHoiRoutes from './routes/cauHoiRoutes.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err))

app.use('/api/cau-hoi', cauHoiRoutes)

const clientPath = path.join(__dirname, 'client-dist')
app.use(express.static(clientPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
