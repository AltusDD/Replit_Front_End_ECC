
#!/usr/bin/env bash
# Restore project files from a timestamped snapshot in .archive/
# Usage:
#   bash scripts/genesis-restore.sh                 # restore newest snapshot
#   bash scripts/genesis-restore.sh <path/to.zip>   # restore specific snapshot
#   NO_INSTALL=1 bash scripts/genesis-restore.sh    # skip npm install

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# pick the zip (latest by default)
ZIP="${1:-}"
if [[ -z "${ZIP}" ]]; then
  if ls -1 .archive/*.zip >/dev/null 2>&1; then
    ZIP="$(ls -t .archive/*.zip | head -1)"
  else
    echo "❌ No snapshots found in .archive/"
    exit 1
  fi
fi
if [[ ! -f "$ZIP" ]]; then
  echo "❌ Snapshot not found: $ZIP"
  exit 1
fi

echo "⏪ Restoring from: $ZIP"
echo "• Root: $ROOT"

# Clean build caches that can fight restores
rm -rf dist .vite .cache coverage 2>/dev/null || true

# Do NOT overwrite node_modules or git metadata
# Keep other current files; unzip will overwrite only files that exist in the snapshot.
unzip -oq "$ZIP" -x "node_modules/*" ".git/*" >/dev/null

echo "📦 Snapshot extracted."
if [[ -z "${NO_INSTALL:-}" ]]; then
  if [[ -f package-lock.json ]]; then
    echo "📥 npm ci ..."
    npm ci
  else
    echo "📥 npm install ..."
    npm install
  fi
else
  echo "⏭️ Skipping npm install (NO_INSTALL=1)."
fi

echo "✅ Restore complete. Start dev with: npm run dev"
