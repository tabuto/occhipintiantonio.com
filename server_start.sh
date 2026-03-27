#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/.server.pid"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Server already running (PID $(cat "$PID_FILE"))"
  exit 0
fi

nohup python3 "$SCRIPT_DIR/server.py" > "$SCRIPT_DIR/.server.log" 2>&1 &
echo $! > "$PID_FILE"
echo "Server started at http://localhost:8080 (PID $!)"
