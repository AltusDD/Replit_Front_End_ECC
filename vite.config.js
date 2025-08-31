import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: { 
    host: true, 
    port: 5000, 
    strictPort: true,
    allowedHosts: ['258f1742-e4c0-4f32-8100-1f937c055471-00-z25yygrpls5w.worf.replit.dev']
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
