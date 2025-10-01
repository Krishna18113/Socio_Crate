import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Unocss()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // your backend server URL
    },
  },  
});

