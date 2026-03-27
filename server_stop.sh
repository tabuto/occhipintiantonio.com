#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/.server.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "No PID file found. Server may not be running."
  exit 1
fi

PID=$(cat "$PID_FILE")
if kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  rm "$PID_FILE"
  echo "Server stopped (PID $PID)"
else
  echo "Server not running (stale PID $PID)"
  rm "$PID_FILE"
  exit 1
fi
