#!/usr/bin/env bash
set -e
mkdir -p public/__audit
PM="npm"; [ -f pnpm-lock.yaml ] && PM="pnpm"; [ -f yarn.lock ] && PM="yarn"
BOOT=$(grep -q 'type="module"' index.html 2>/dev/null && echo present || echo maybe)
ENH=$(rg -n 'mountEnhancer|CardEnhancer' src 2>/dev/null || true)
ROUTES=$(rg -n '/card/(owner|property|unit|lease|tenant)' src 2>/dev/null || true)
FLAGS=$(curl -sS http://localhost:8787/api/config/integrations || echo '{}')
ZSCAN=$(rg -n 'z-index\s*:\s*([1-9][0-9]{2,})' src/styles src/features 2>/dev/null || true)
GITBR=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')
GITHASH=$(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')
DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ' || echo '0')
cat > public/__audit/ui_audit.json <<JSON
{
  "pm":"$PM",
  "bootloader":"$BOOT",
  "enhancer_refs": ${ENH@Q},
  "routes_refs": ${ROUTES@Q},
  "flags": $FLAGS,
  "zindex_hits": ${ZSCAN@Q},
  "git": { "branch":"$GITBR", "last":"$GITHASH", "dirty": "$DIRTY" },
  "ts": "$(date -Iseconds)"
}
JSON
echo "Wrote public/__audit/ui_audit.json"