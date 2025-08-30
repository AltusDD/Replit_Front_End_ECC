import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins:[react()],
  resolve:{ alias:{
    '@': path.resolve(__dirname,'./src'),
    '@lib': path.resolve(__dirname,'./src/lib'),
  }},
  server:{
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    allowedHosts: true,
    proxy:{
      '/api': {
        target: 'https://empirecommandcenter-altus-staging.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});
