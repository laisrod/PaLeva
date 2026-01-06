import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|js)$/,
    }),
    RubyPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
})

