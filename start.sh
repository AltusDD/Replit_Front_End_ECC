#!/bin/bash

# Kill any old Vite process
pkill -f "vite" || true

# Use $PORT if set, else 5173
PORT=${PORT:-5173}

# Run the dev server
npm run dev -- --host 0.0.0.0 --port "$PORT"