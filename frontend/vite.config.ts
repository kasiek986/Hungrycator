import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Zapytania /api trafiają do backendu Express (npm --prefix backend run dev)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
