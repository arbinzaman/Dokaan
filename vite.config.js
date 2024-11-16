import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Enable hot reload
    hmr: true,
  },
  build: {
    // Optimize dependencies
    commonjsOptions: {
      include: [/react-router-dom/],
    },
  },
  // Experimental settings to control React behavior with Vite
  define: {
    'process.env': {},
    'REACT_APP_ROUTER_V6': true,
  },
  optimizeDeps: {
    include: ['react-router-dom'],
  },
});
