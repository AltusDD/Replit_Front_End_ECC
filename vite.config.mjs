import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",       // explicitly bind to 0.0.0.0
    port: process.env.PORT || 5173,  // use PORT env var from Replit
    strictPort: false,     // allow fallback ports  
    allowedHosts: true,    // allow all hosts including Replit's dynamic hosts
    hmr: false             // disable HMR to avoid connection issues
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: false
  }
});
