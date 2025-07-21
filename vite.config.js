import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: ['colyseus.js']
  },
  define: {
    global: 'globalThis',
  },
  build: {
    commonjsOptions: {
      include: [/colyseus\.js/, /node_modules/]
    }
  }
})
