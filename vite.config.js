import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: { 
    host: true, 
    port: 5000, 
    strictPort: true,
    allowedHosts: 'all'
  },
  preview: { 
    host: true, 
    port: 5000, 
    strictPort: true,
    allowedHosts: 'all'
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@lib": path.resolve(import.meta.dirname, "./src/lib"),
      "@assets": path.resolve(import.meta.dirname, "./attached_assets"),
    },
  },
});
