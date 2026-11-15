import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/DONKI-API': {
        target: 'https://ccmc.gsfc.nasa.gov',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

