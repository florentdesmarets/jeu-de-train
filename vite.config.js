// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Remplace 'train-runner' par le nom exact de ton dépôt GitHub
export default defineConfig({
  plugins: [react()],
  base: '/jeu-de-train/',
})
