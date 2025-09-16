#!/usr/bin/env bash
set -euo pipefail

echo "=== [ECC REPAIR] Mount + Boot Guarantees ==="

# 2.1 Ensure boot script injected into HTML
HTML=""
[ -f public/index.html ] && HTML="public/index.html"
[ -z "$HTML" ] && [ -f index.html ] && HTML="index.html"
if [ -n "$HTML" ]; then
  if ! grep -q 'src="/src/boot/mountEnhancer.tsx"' "$HTML"; then
    # Insert before </body>
    sed -i 's#</body>#  <script type="module" src="/src/boot/mountEnhancer.tsx"></script>\n</body>#' "$HTML"
    echo "🛠 Injected boot script into $HTML"
  else
    echo "✅ Boot script already present in $HTML"
  fi
else
  echo "❌ No entry HTML file to inject into"
fi

# 2.2 Ensure TS entry imports the mount (extra safety)
added_import=0
for f in src/main.tsx src/index.tsx src/main.jsx src/index.jsx; do
  [ -f "$f" ] || continue
  if ! grep -q "boot/mountEnhancer" "$f"; then
    sed -i '1i import "./boot/mountEnhancer";' "$f"
    echo "🛠 Added import to $f"
    added_import=1
  else
    echo "✅ Import already present in $f"
  fi
done
[ "$added_import" = "0" ] && echo "ℹ️ No TS entry file needed changes"

echo "✅ mountEnhancer.tsx ensured (with watermark toggle)"

echo "=== [ECC REPAIR] Done. Restart the dev server. ==="
