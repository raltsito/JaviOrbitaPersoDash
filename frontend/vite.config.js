import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // En desarrollo, las llamadas /api van al backend Django
      // Puerto 8001: el 8000 suele estar ocupado por otros proyectos locales
      '/api': 'http://localhost:8001',
    },
  },
})
