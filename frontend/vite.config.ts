import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All calls to /api/* are forwarded to Spring Boot on 8080
      // This makes the browser see them as same-origin → no CORS
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Strip /api prefix: /api/products → /products
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
