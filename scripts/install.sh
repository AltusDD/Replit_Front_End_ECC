#!/usr/bin/env bash
set -e
# Install deps only if missing
if [ ! -d node_modules ]; then
  npx -y pnpm@10.15.0 install
fi
