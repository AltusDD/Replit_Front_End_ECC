#!/bin/bash
set -e

echo "[ECC AUDIT] Starting Full Replit Agent Audit..."

# 1. Check Enhancer Mounts
find src/features -name "*Enhancer.tsx" 2>/dev/null | while read f; do
  name=$(basename "$f")
  if [ -f src/boot/mountEnhancer.tsx ]; then
    grep -q "$name" src/boot/mountEnhancer.tsx && echo "✅ Mounted: $name" || echo "❌ Unmounted: $name"
  else
    echo "ℹ️  No mountEnhancer.tsx found"
  fi
done

# 2. Check Public Index Bootloader
if [ -f index.html ]; then
  if grep -q 'script type="module"' index.html; then
    echo "✅ index.html script module present"
  else
    echo "❌ index.html missing script module fallback"
  fi
else
  echo "ℹ️  No index.html found"
fi

# 3. Validate API Integration Flags
echo "🔍 Checking API endpoints..."
curl -s http://localhost:5000/api/config/integrations 2>/dev/null | jq '.' >/dev/null && echo "✅ /api/config/integrations works" || echo "❌ /api/config/integrations failed"

# 4. Check Feature Flags in Enhancers
echo "🔍 Checking feature flags..."
if command -v rg >/dev/null 2>&1; then
  rg 'if.*features?.*\.' src/features 2>/dev/null | grep -v node_modules || echo "🔍 No feature flag checks found"
else
  grep -r 'if.*features.*\.' src/features 2>/dev/null | grep -v node_modules || echo "🔍 No feature flag checks found"
fi

# 5. Uncommitted Files
echo "🔍 Checking git status..."
git status --short 2>/dev/null || echo "✅ All changes committed or no git"

# 6. Grep for ECC UI Signature
echo "🔍 Checking ECC UI signatures..."
if command -v rg >/dev/null 2>&1; then
  rg 'ECC Enhancer Active' src 2>/dev/null || echo "❌ ECC UI Signature missing"
else
  grep -r 'ECC Enhancer Active' src 2>/dev/null || echo "❌ ECC UI Signature missing"
fi

# 7. Check Common Entry Routes
echo "🔍 Checking routes..."
for path in lease property unit tenant owner; do
  if command -v rg >/dev/null 2>&1; then
    if rg "/card/$path/" src/features 2>/dev/null >/dev/null; then
      echo "✅ Route $path found in UI"
    else
      echo "❌ Route $path missing"
    fi
  else
    if grep -r "/card/$path/" src/features 2>/dev/null >/dev/null; then
      echo "✅ Route $path found in UI"
    else
      echo "❌ Route $path missing"
    fi
  fi
  curl -sf "http://localhost:5000/card/$path/testid" >/dev/null 2>&1 && echo "✅ $path route served" || echo "⚠️ $path route unreachable"
done

# 8. Secrets Visibility
echo "🔍 Checking secrets..."
for key in M365_TOKEN DROPBOX_KEY DOORLOOP_API_KEY CORELOGIC_TOKEN; do
  if [[ -z "${!key}" ]]; then echo "🔒 $key MISSING"; else echo "✅ $key present"; fi
done

# 9. Check Systems Integration Page
echo "🔍 Checking Systems → Integrations..."
curl -sf "http://localhost:5000/systems/integrations" >/dev/null 2>&1 && echo "✅ Systems integrations page served" || echo "⚠️ Systems integrations page unreachable"

# 10. Check Admin Integration Endpoints
echo "🔍 Checking admin integration endpoints..."
curl -sf "http://localhost:5000/api/admin/integrations/doorloop/ping" >/dev/null 2>&1 && echo "✅ DoorLoop ping endpoint available" || echo "⚠️ DoorLoop ping endpoint unreachable"

# 11. Check SSE Logs Endpoint
echo "🔍 Checking SSE logs endpoint..."
curl -sf "http://localhost:5000/api/admin/sync/logs/stream" >/dev/null 2>&1 && echo "✅ SSE logs endpoint available" || echo "⚠️ SSE logs endpoint missing"

# 12. Check DLQ Endpoints
echo "🔍 Checking Dead Letter Queue endpoints..."
curl -sf "http://localhost:5000/api/admin/sync/dlq" >/dev/null 2>&1 && echo "✅ DLQ endpoint available" || echo "⚠️ DLQ endpoint missing"

# 13. Check Sync Control Endpoints
echo "🔍 Checking sync control endpoints..."
curl -sf "http://localhost:5000/api/admin/sync/status" >/dev/null 2>&1 && echo "✅ Sync status endpoint available" || echo "⚠️ Sync status endpoint missing"

echo "[✔] ECC Replit Full Audit Complete"