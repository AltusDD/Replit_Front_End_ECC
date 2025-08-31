
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5000,
    strictPort: true,
    allowedHosts: true, // ✅ key line
    hmr: {
      protocol: "wss",
      clientPort: 443,
    },
  },
  preview: {
    host: true,
    port: 5000,
    strictPort: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@lib": path.resolve(import.meta.dirname, "./src/lib"),
      "@assets": path.resolve(import.meta.dirname, "./attached_assets"),
    },
  },
});
