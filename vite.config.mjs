import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'https://empirecommandcenter-altus-staging.azurewebsites.net',
        changeOrigin: true,
        secure: true,
        headers: (process.env.VITE_API_KEY ? {'x-api-key': process.env.VITE_API_KEY} : {}),
      },
    },
  },
});
