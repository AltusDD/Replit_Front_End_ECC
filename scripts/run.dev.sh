#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-5173}"

# Free the port if something is stuck
(lsof -tiTCP:$PORT -sTCP:LISTEN | xargs -r kill -9) 2>/dev/null || true

# Ensure deps exist
if [ ! -d node_modules ]; then
  npx -y pnpm@10.15.0 install
fi

# Run Vite in a way Replit can track (no early exit)
exec npx -y vite@5.4.19 --host --port "$PORT"
