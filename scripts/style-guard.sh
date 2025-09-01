#!/usr/bin/env bash
set -e
# CSS must be imported only from src/main.tsx
if rg -n "import .*/styles/.*css" src | grep -v "src/main.tsx"; then
  echo "❌ CSS imports found outside src/main.tsx"; exit 1
fi
# side-nav.css must not reappear
test ! -f src/styles/side-nav.css || { echo "❌ side-nav.css exists"; exit 1; }
echo "✅ style guard passed"
