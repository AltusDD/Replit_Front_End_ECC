import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replit runs your preview on a *.replit.dev (and *.repl.co/*worf.replit.dev) host.
// Use allowedHosts to allow those dynamic hosts.
const allowed = [
  ".replit.dev",
  ".repl.co",
  ".worf.replit.dev"
];

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // 0.0.0.0
    port: 5173,
    strictPort: true,
    allowedHosts: allowed
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true
  }
});
