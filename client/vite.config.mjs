// client/vite.config.js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: './', // 👈 Quan trọng để tránh trắng trang khi deploy subpath
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 👈 Thêm để hỗ trợ alias "@/"
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://kahoot-4f1i.onrender.com',
        changeOrigin: true
        // Không rewrite /api => đúng rồi
      }
    }
  },
  build: {
    outDir: '../server/client-dist', // 👈 Nếu deploy chung server
    emptyOutDir: true
  }
})
