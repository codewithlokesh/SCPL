import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: true,
    sourcemap: false,
    target: 'esnext',
  },
  server: {
    open: true, 
  },
  css: {
    devSourcemap: true,  
  },
})
