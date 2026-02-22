#!/usr/bin/env bash
# Run all Lab Charts browser tests headlessly
# Starts a temp server, runs tests, kills server on exit

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=${PORT:-8000}

# Find Puppeteer — check npx cache, then local node_modules
NODE_PATH_EXTRA=""
if [ -d "$HOME/.npm/_npx" ]; then
  NPX_DIR=$(find "$HOME/.npm/_npx" -path "*/node_modules/puppeteer" -type d 2>/dev/null | head -1 | sed 's|/puppeteer$||')
  [ -n "$NPX_DIR" ] && NODE_PATH_EXTRA="$NPX_DIR"
fi
[ -d "$DIR/node_modules/puppeteer" ] && NODE_PATH_EXTRA="$DIR/node_modules"

if [ -z "$NODE_PATH_EXTRA" ]; then
  echo "Puppeteer not found. Install with: npm i -g puppeteer"
  exit 2
fi

# Start server if not already running
SERVER_PID=""
if ! curl -s -o /dev/null "http://localhost:$PORT/" 2>/dev/null; then
  python3 -m http.server "$PORT" -d "$DIR" &>/dev/null &
  SERVER_PID=$!
  sleep 1
  echo "Started server on :$PORT (PID $SERVER_PID)"
fi

cleanup() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null && echo "Stopped server"
  return 0
}
trap cleanup EXIT

PORT=$PORT NODE_PATH="$NODE_PATH_EXTRA" node "$DIR/run-tests.js"
