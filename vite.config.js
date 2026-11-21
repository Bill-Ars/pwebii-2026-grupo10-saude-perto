import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// "base" tem de ser igual ao nome do repositório no GitHub,
// para que o GitHub Pages encontre os ficheiros (CSS, JS, dados).
export default defineConfig({
  plugins: [vue()],
  base: '/pwebii-2026-grupo10-saude-perto/',
})
