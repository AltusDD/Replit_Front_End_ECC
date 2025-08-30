import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
const allowed = true; // Replit ephemeral hosts
export default defineConfig({
  plugins:[react()],
  resolve:{ alias:{ '@': path.resolve(__dirname,'./src'), '@lib': path.resolve(__dirname,'./src/lib') } },
  server:{
    host:'0.0.0.0', port: Number(process.env.PORT)||5000, strictPort:false, allowedHosts:allowed,
    proxy:{
      '/api':{
        target: process.env.VITE_API_TARGET || 'https://empirecommandcenter-altus-staging.azurewebsites.net',
        changeOrigin:true, secure:true,
        // pass-through auth header if provided
        configure:(proxy, _opts)=>{
          proxy.on('proxyReq',(pReq, req)=>{ if(req.headers['x-api-key']) pReq.setHeader('x-api-key', req.headers['x-api-key']); });
        }
      }
    }
  }
});