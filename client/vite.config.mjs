// vite.config.js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://kahoot-4f1i.onrender.com',
        changeOrigin: true,
        // Giữ nguyên /api trong đường dẫn (KHÔNG rewrite!)
      }
    }
  }
})
