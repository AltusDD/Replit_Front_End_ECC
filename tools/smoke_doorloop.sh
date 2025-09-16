#!/usr/bin/env bash
set -euo pipefail

: "${DOORLOOP_BASE_URL:=https://app.doorloop.com/api}"
: "${DOORLOOP_API_KEY:?DOORLOOP_API_KEY is required}"

echo "➡️  Hitting DoorLoop /owners (page_size=1)…"
curl -sS -H "Authorization: bearer ${DOORLOOP_API_KEY}" \
     "${DOORLOOP_BASE_URL}/owners?page_size=1" | head -c 400 && echo

echo "✅ DoorLoop reachable"