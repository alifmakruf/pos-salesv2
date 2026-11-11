import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Code-split: pisahkan vendor besar agar initial bundle lebih kecil
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-scanner': ['html5-qrcode'],   // Scanner hanya dimuat saat dibutuhkan
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    // Batas warning chunk (tidak mempengaruhi performa, hanya CI)
    chunkSizeWarningLimit: 600,
  },
})
