import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",       // explicitly bind to 0.0.0.0
    port: process.env.PORT || 5173,  // use PORT env var from Replit
    strictPort: true,      // enforce exact port
    allowedHosts: ["all"],  // allow all hosts including Replit's dynamic hosts
    hmr: { 
      clientPort: 443,
      host: "0.0.0.0"
    }
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: false
  }
});
