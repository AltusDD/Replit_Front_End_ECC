#!/usr/bin/env bash
set -e
id="${1:-42}"
echo "[ECC] Probing property id=$id"
echo -n "  /api/entities/properties/$id -> "
curl -s -o public/__audit/prop_by_id.json -w "%{http_code}\n" "http://localhost:5173/api/entities/properties/$id"
echo -n "  /api/portfolio/properties (filter) -> "
code=$(curl -s -o public/__audit/prop_list.json -w "%{http_code}" "http://localhost:5173/api/portfolio/properties")
echo "$code (saved)"
if [ -f public/__audit/prop_list.json ]; then
  echo "  match in list:"
  node - <<'NODE'
const fs = require('fs');
const id = Number(process.argv[2]||42);
try {
  const raw = fs.readFileSync('public/__audit/prop_list.json', 'utf8');
  const j = JSON.parse(raw);
  const items = j.items || j.data || (Array.isArray(j)?j:[]);
  const hit = (items||[]).find(p => Number(p?.id) === id);
  console.log(hit ? JSON.stringify(hit, null, 2) : '  (no match)');
} catch(e){ console.log('  (parse error)'); }
NODE
fi