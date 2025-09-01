import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",       // explicitly bind to 0.0.0.0
    port: 5173,            // default; Replit will set PORT env too
    strictPort: false,     // allow fallback
    hmr: { clientPort: 443 } // HMR for Replit
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: false
  }
});
