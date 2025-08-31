
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5000,
    strictPort: true,
    allowedHosts: true, // allow Replit's dynamic work host
    hmr: { clientPort: 443 } // stable HMR in Replit preview
  },
  preview: {
    host: true,
    port: 5000,
    strictPort: true,
    allowedHosts: true
  }
});
