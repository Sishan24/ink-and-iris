import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In development the browser talks to Vite, and Vite forwards /api to the Express server
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
  },
});
