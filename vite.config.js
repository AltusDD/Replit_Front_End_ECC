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
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "258f1742-e4c0-4f32-8100-1f937c055471-00-z25yygrpls5w.worf.replit.dev",
      ".replit.dev",
      ".replit.co"
    ],
    watch: {
      usePolling: true,
      interval: 400,
      ignored: ["**/node_modules/**", "**/.git/**", "**/.local/share/pnpm/**"],
    },
  },
  optimizeDeps: { 
    disabled: false,
    include: ['use-sync-external-store/shim'],
    force: true
  },
  define: {
    global: 'globalThis',
  },
});
