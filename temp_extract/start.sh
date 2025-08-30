#!/usr/bin/env bash
set -e

# Kill anything that might be holding ports (old backend or vite)
pkill -f "node .*start-server" >/dev/null 2>&1 || true
pkill -f vite >/dev/null 2>&1 || true

# Start Vite on the assigned PORT (or 5173)
PORT="${PORT:-5173}"
echo "[Frontend] Starting Vite on $PORT ..."
npm run dev -- --host 0.0.0.0 --port "$PORT"
