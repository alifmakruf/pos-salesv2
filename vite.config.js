import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // CSS inline threshold: CSS < 4KB di-inline ke HTML (mengurangi round-trip request)
    // Vite default sudah 4096, kita naikkan sedikit agar critical CSS ter-inline
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-scanner': ['html5-qrcode'],  // Lazy loaded, tidak di initial bundle
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
