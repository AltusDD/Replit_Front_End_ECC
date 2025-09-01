import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,   // accept Replit worf.* host
    hmr: { clientPort: 443 }
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true
  }
});
