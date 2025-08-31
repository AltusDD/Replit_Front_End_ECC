#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   bash scripts/genesis-restore.sh            # auto-pick latest .archive/*.zip
#   bash scripts/genesis-restore.sh .archive/estatecommand-snapshot-YYYYMMDD-HHMMSS.zip

ZIP="${1:-}"

# Auto-pick the newest snapshot if none provided
if [[ -z "${ZIP}" ]]; then
  ZIP="$(ls -t .archive/*.zip 2>/dev/null | head -1 || true)"
fi

if [[ -z "${ZIP:-}" || ! -f "${ZIP}" ]]; then
  echo "❌ No snapshot zip found. Expected at .archive/*.zip"
  exit 1
fi

echo "⏪ Restoring from: ${ZIP}"
# remove build caches that can fight the restore
rm -rf dist .vite .cache || true

# restore (do not overwrite node_modules or .git)
unzip -o "${ZIP}" -x "node_modules/*" ".git/*" >/dev/null

echo "📦 Reinstalling deps..."
npm ci

echo "✅ Restore complete. Start dev with: npm run dev"