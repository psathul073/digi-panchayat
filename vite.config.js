import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({
    open: true, // Opens report automatically
    filename: 'dist/stats.html', // Output location
    gzipSize: true,
    brotliSize: true,
  }),],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('jspdf')) return 'jspdf';
            if (id.includes('html2canvas')) return 'html2canvas';
            if (id.includes('firebase')) return 'firebase';
            return id.toString().split('node_modules/')[1].split('/')[0];
          }
        }

      }
    }
  }
})
