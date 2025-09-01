import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PORT = Number(process.env.PORT) || 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // 0.0.0.0
    port: PORT,
    strictPort: true,
    allowedHosts: true
  },
  preview: {
    host: true,
    port: PORT,
    strictPort: true
  }
});
