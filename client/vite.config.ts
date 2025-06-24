import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ¡IMPORTANTE! Esto es para deploy en GitHub Pages en /gymapp/
export default defineConfig({
  plugins: [react()],
  base: '/gymapp/',
})
