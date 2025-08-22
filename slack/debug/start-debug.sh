#!/bin/bash

# Slack Debug Mode Startup Script
# Starts both the main server and the debug monitor

set -e

echo "🔍 Starting Slack Integration in DEBUG MODE"
echo "==========================================="
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Navigate to project root
cd "$PROJECT_ROOT"

# Set debug environment
export NODE_ENV=development
export DEBUG_MODE=true

# Kill any existing processes
echo "🛑 Stopping any existing servers..."
PID1=$(lsof -ti :8765 2>/dev/null || true)
PID2=$(lsof -ti :8766 2>/dev/null || true)

if [ ! -z "$PID1" ]; then
    kill $PID1 2>/dev/null || true
    echo "  Stopped process on port 8765"
fi

if [ ! -z "$PID2" ]; then
    kill $PID2 2>/dev/null || true
    echo "  Stopped process on port 8766"
fi

sleep 2

# Start the main server
echo ""
echo "🚀 Starting main Slack server on port 8765..."
node src/proxy/cursor-web-proxy.js &
MAIN_PID=$!
echo "  Main server PID: $MAIN_PID"

sleep 2

# Start the debug monitor
echo ""
echo "🔍 Starting debug monitor on port 8766..."
node slack/debug/slack-event-monitor.js &
MONITOR_PID=$!
echo "  Monitor PID: $MONITOR_PID"

sleep 2

# Start the tunnel if requested
if [ "$1" == "--with-tunnel" ]; then
    echo ""
    echo "🌐 Starting Cloudflare tunnel..."
    if [ -f "$PROJECT_ROOT/cloudflare-tunnel/start-tunnel.sh" ]; then
        "$PROJECT_ROOT/cloudflare-tunnel/start-tunnel.sh" &
        TUNNEL_PID=$!
        echo "  Tunnel PID: $TUNNEL_PID"
    else
        echo "  ⚠️ Tunnel script not found"
    fi
fi

# Set up cleanup
trap "echo ''; echo 'Stopping all processes...'; kill $MAIN_PID $MONITOR_PID $TUNNEL_PID 2>/dev/null || true; exit" INT TERM

echo ""
echo "==========================================="
echo "✅ Debug mode is active!"
echo ""
echo "📍 Services running:"
echo "  • Main server: http://localhost:8765"
echo "  • Debug monitor: http://localhost:8766"
echo "  • Monitor status: http://localhost:8766/status"
echo ""
echo "📊 Slack endpoints (via public URL):"
echo "  • https://automation.verygoodplugins.com/slack/events"
echo "  • https://automation.verygoodplugins.com/slack/commands"
echo "  • https://automation.verygoodplugins.com/slack/interactive"
echo ""
echo "📝 Log files:"
echo "  • slack/debug/slack-events.log"
echo "  • slack/debug/slack-events-detailed.json"
echo ""
echo "🧪 To test the connection, run:"
echo "  node slack/debug/test-slack-connection.js"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo "==========================================="
echo ""

# Keep running
wait $MAIN_PID