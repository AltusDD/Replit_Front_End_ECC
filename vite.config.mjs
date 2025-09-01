import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,            // bind 0.0.0.0
    port: 5173,            // default; Replit will set PORT env too
    strictPort: false,     // allow fallback
    allowedHosts: true     // accept worf.* hosts
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: false
  }
});
