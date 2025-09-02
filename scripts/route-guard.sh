#!/usr/bin/env bash
set -e
FILE=src/App.tsx
miss=0

# Helper: check either static import (`from "..."`) OR dynamic import (`import("...")`)
check() {
  local p="$1"
  if rg -n "from \"$p\"" "$FILE" >/dev/null || rg -n "import\\(\\s*\"$p\"\\s*\\)" "$FILE" >/dev/null; then
    echo "✅ found $p"
  else
    echo "❌ missing import: $p in $FILE"
    miss=1
  fi
}

for p in \
  './pages/dashboard' \
  './pages/portfolio/properties' \
  './pages/portfolio/units' \
  './pages/portfolio/leases' \
  './pages/portfolio/tenants' \
  './pages/portfolio/owners'
do
  check "$p"
done

[ $miss -eq 0 ] && echo "✅ route guard passed"
exit $miss
