import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const PORT = Number(process.env.PORT) || 5000;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: PORT,
    strictPort: true,
    // Allow Replit preview hosts (future ephemeral subdomains) + local
    allowedHosts: true,
    hmr: { protocol: "wss", clientPort: 443 },
  },
  preview: {
    host: true,
    port: PORT,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@lib": path.resolve(import.meta.dirname, "./src/lib"),
      "@assets": path.resolve(import.meta.dirname, "./attached_assets"),
    },
  },
});
