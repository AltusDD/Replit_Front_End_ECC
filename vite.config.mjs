import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const allowed = (process.env.VITE_ALLOWED_HOST || '')
  .split(',').map(s => s.trim()).filter(Boolean);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src'), '@lib': path.resolve(__dirname, './src/lib') }
  },
  css: { postcss: { plugins: [] } },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    allowedHosts: allowed.length ? allowed : true,
    proxy: {
      '/api': {
        target: 'https://empirecommandcenter-altus-staging.azurewebsites.net',
        changeOrigin: true, secure: true,
      }
    }
  }
});
