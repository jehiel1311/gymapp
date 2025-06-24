import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ¡IMPORTANTE! Base para deployar en GitHub Pages dentro de /gymapp/
export default defineConfig({
  plugins: [react()],
  base: '/gymapp/',
})
