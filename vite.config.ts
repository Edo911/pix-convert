import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['heic2any', 'utif', 'gifenc'],
  },
  build: {
    chunkSizeWarningLimit: 2400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('heic2any')) return 'vendor-heic'
            if (id.includes('utif')) return 'vendor-utif'
            if (id.includes('gifenc')) return 'vendor-gif'
            return 'vendor'
          }
        },
      },
    },
  },
})
