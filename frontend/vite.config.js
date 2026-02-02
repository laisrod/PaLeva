import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5176,
    proxy: {
      // Proxy para API do Rails backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy para WebSocket (Action Cable)
      '/cable': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
