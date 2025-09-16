#!/usr/bin/env bash
set -e
mkdir -p public/__audit
echo "[ECC] Probing portfolio APIs…"
for ep in properties units leases tenants owners; do
  echo -n "/api/portfolio/$ep -> "
  code=$(curl -s -o "public/__audit/sample_$ep.json" -w "%{http_code}" "http://localhost:8787/api/portfolio/$ep")
  echo "$code (saved to public/__audit/sample_$ep.json)"
done