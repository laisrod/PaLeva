/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  
  base: process.env.GITHUB_PAGES ? '/PaLeva/' : '/',
  server: {
    port: 5176,
    host: '0.0.0.0',
    proxy: {
      // Proxy para API do Rails backend
      // Em Docker, usa o nome do serviço; localmente, usa localhost
      '^/api/.*': {
        target: process.env.VITE_DOCKER === 'true' ? 'http://backend:3000' : 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy para WebSocket (Action Cable)
      '^/cable.*': {
        target: process.env.VITE_DOCKER === 'true' ? 'ws://backend:3000' : 'ws://localhost:3000',
        ws: true,
        changeOrigin: true,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
      ],
    },
  },
})
