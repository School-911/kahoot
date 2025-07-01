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

// API
app.use('/api/cau-hoi', cauHoiRoutes)

// Serve static files
const clientPath = path.join(__dirname, 'client-dist')
app.use(express.static(clientPath))

// Route fallback for Vue Router
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
