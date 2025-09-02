import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "src/lib"), 
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@config": path.resolve(__dirname, "src/config"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/components": path.resolve(__dirname, "src/components"),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: "all",  // ✅ This fixes Replit hostname blocking
    watch: {
      usePolling: true,
      interval: 400,
      ignored: ["**/node_modules/**", "**/.git/**", "**/.local/share/pnpm/**"],
    },
  },
  optimizeDeps: { disabled: true },
});
