import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // 👈 Bind to all network interfaces
    port: 3021,       // 👈 Optional, default is 5173
  },
});
