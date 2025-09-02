cat > vite.config.ts <<'TS'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // honor tsconfig.json "paths"
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@config": path.resolve(__dirname, "src/config"),
      // accept "@/lib/.." form too, if it appears
      "@/components": path.resolve(__dirname, "src/components"),
      "@/lib": path.resolve(__dirname, "src/lib"),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 400,
      ignored: ["**/node_modules/**","**/.git/**","**/.local/share/pnpm/**"],
    },
    fs: { strict: true, allow: [path.resolve(__dirname, "src")] },
  },
  optimizeDeps: { disabled: true }, // reduce watcher churn on Replit
});
TS
