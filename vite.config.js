import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Cho phép từ bất kỳ địa chỉ IP nào
    port: 5173,
    allowedHosts: ['aac0cdf25fe1.ngrok-free.app'],
  },
})