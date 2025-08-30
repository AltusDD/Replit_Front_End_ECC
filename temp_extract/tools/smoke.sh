#!/usr/bin/env bash
# tools/smoke.sh
# Empire Command Center – smoke tests for styling, exports, and counts fallback.

set -Eeuo pipefail

red(){ printf "\033[31m%s\033[0m\n" "$*"; }
grn(){ printf "\033[32m%s\033[0m\n" "$*"; }
ylw(){ printf "\033[33m%s\033[0m\n" "$*"; }
sec(){ printf "\n\033[36m== %s ==\033[0m\n" "$*"; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

FAIL=0

# -------- 1) Find a live dev port (try 3000, 5173, 5000) --------
sec "Probe dev server"
PORTS=(3000 5173 5000)
LIVE_PORT=""
for p in "${PORTS[@]}"; do
  if curl -sSf "http://localhost:$p/" >/dev/null 2>&1; then
    LIVE_PORT="$p"
    break
  fi
done
if [[ -z "$LIVE_PORT" ]]; then
  red "No dev server detected on 3000/5173/5000. Start it, then re-run."
  exit 1
fi
grn "Dev server detected on :$LIVE_PORT"

# -------- 2) Styling contract checks --------
sec "Styling contract"
MAIN="src/main.tsx"
if ! grep -q "import './styles/theme.css'" "$MAIN"; then
  red "Missing import of styles/theme.css in $MAIN"
  FAIL=1
else grn "theme.css imported in $MAIN"; fi

if ! grep -q "import './styles/app.css'" "$MAIN"; then
  red "Missing import of styles/app.css in $MAIN"
  FAIL=1
else grn "app.css imported in $MAIN"; fi

EXTRA_CSS=$(grep -RIl --include='*.ts' --include='*.tsx' "import .*\.css" src | grep -v "^$MAIN$" || true)
if [[ -n "$EXTRA_CSS" ]]; then
  red "Found rogue CSS imports outside $MAIN:"
  echo "$EXTRA_CSS" | sed 's/^/  - /'
  FAIL=1
else grn "No rogue CSS imports outside $MAIN"; fi

INLINE_STYLE=$(grep -RIl --include='*.tsx' '<style>' src || true)
if [[ -n "$INLINE_STYLE" ]]; then
  red "Found inline <style> blocks (should be none):"
  echo "$INLINE_STYLE" | sed 's/^/  - /'
  FAIL=1
else grn "No inline <style> blocks found"; fi

# -------- 3) Library exports present --------
sec "Data layer exports"
LIB="src/lib/useApi.ts"
check_export () {
  local sig="$1"
  if grep -q "$sig" "$LIB"; then grn "export OK: $sig"
  else red "export MISSING: $sig"; FAIL=1; fi
}
check_export "export function buildUrl"
check_export "export function useCounts"
check_export "export function useCollection"
check_export "export function fetchCollection"

# -------- 4) API/proxy + counts fallback sanity --------
sec "API/proxy & counts sanity"

probe_json () {
  local url="$1"
  local out
  out=$(curl -sS -m 8 "http://localhost:${LIVE_PORT}${url}" || true)
  if [[ -n "$out" ]]; then
    echo "$out" | head -c 200
    echo
  else
    echo "(no response)"
  fi
}

ylw "Try /api/health (may be absent in some envs)"
probe_json "/api/health"

ylw "Try counts endpoints (RPC then aggregate)"
probe_json "/api/rpc/portfolio_counts"
probe_json "/api/portfolio/counts"

ylw "Derive counts from collections (fallback)"
node - <<'NODE'
const base = `http://localhost:${process.env.PORT || process.env.LIVE_PORT || '3000'}`.replace(/\/$/,'');
const fetchJson = async (u) => (await fetch(u)).json().catch(()=>null);
(async () => {
  const cols = ['properties','units','leases','tenants','owners'];
  const out = {};
  for (const c of cols) {
    // header/total fallback using small page
    let url = `${base}/api/portfolio/${c}?limit=1`;
    try {
      const res = await fetch(url);
      const h = Number(res.headers.get('x-total-count') || res.headers.get('x-total') || '');
      if (!Number.isNaN(h) && h >= 0) { out[c] = h; continue; }
      const j = await res.json().catch(()=>null);
      const t = Number((j && (j.total || j?.meta?.total)) || '');
      if (!Number.isNaN(t) && t >= 0) { out[c] = t; continue; }
    } catch {}
    // last resort: len
    try {
      const j = await fetchJson(`${base}/api/portfolio/${c}`);
      const n = Array.isArray(j?.items) ? j.items.length :
                Array.isArray(j?.data)  ? j.data.length  :
                Array.isArray(j)        ? j.length       : 0;
      out[c] = n;
    } catch { out[c] = -1; }
  }
  console.log(JSON.stringify(out, null, 2));
})();
NODE
echo "(The object above should show non-negative integers; -1 means the collection route failed.)"

# -------- 5) Summary --------
sec "Summary"
if [[ $FAIL -ne 0 ]]; then
  red "❌ Smoke test FAILED ($FAIL issues). See details above."
  exit 1
else
  grn "✅ Smoke test PASSED (styling contract and exports intact)."
  ylw "Counts endpoints may still be absent server-side, but UI fallback should render numbers."
fi