#!/usr/bin/env bash
set -e
bash tools/ecc_ui_audit.sh
echo "===== QUICK SUMMARY ====="
if command -v jq &> /dev/null; then
  jq '.bootloader, .flags, .git' public/__audit/ui_audit.json
else
  cat public/__audit/ui_audit.json
fi
echo "========================="