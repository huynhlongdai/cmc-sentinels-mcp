import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative base so it works on both Vercel (/) and GitHub Pages (/cmc-sentinels-mcp/)
export default defineConfig({
  plugins: [react()],
  base: './',
})
