#!/usr/bin/env bash
set -euo pipefail

# If you already have internal HTTP endpoints for sync, call them here.
# Otherwise, invoke your ETL functions via ts-node or a small CLI wrapper.

entities=("owners" "properties" "units" "leases" "tenants")

for e in "${entities[@]}"; do
  echo "➡️  Backfilling ${e}…"
  # Example: HTTP trigger (adjust to your app)
  curl -sS -X POST "http://localhost:5173/api/admin/sync/run" \
    -H "Content-Type: application/json" \
    -d "{\"entities\":[\"${e}\"],\"mode\":\"backfill\"}" | jq .
done