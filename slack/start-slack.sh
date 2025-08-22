#!/bin/bash

# Unified Slack Integration Starter Script for Claude Automation Hub
# This script starts the Cursor Web Proxy with Slack support and optional tunnel

set -e

echo "🚀 Claude Automation Hub - Slack Integration Starter"
echo "====================================================="
echo ""

# Get the script directory (works even if called from elsewhere)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Navigate to project directory
cd "$PROJECT_ROOT"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Kill any existing process on port 8765
PID=$(lsof -ti :8765 2>/dev/null || true)
if [ ! -z "$PID" ]; then
    echo "⚠️  Stopping existing process on port 8765 (PID: $PID)..."
    kill $PID 2>/dev/null || true
    sleep 2
fi

# Start the server
echo "🚀 Starting Cursor Web Proxy with Slack support..."
node src/proxy/cursor-web-proxy.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test the endpoints
echo "🧪 Testing endpoints..."
echo ""

# Test health with better error handling
if curl -s http://localhost:8765/health | python3 -m json.tool 2>/dev/null; then
    echo "✅ Health check passed"
else
    echo "⚠️  Health check failed - server may still be starting"
fi

echo ""

# Test Slack endpoint
if curl -s http://localhost:8765/slack/events 2>/dev/null | head -1 | grep -q "ready"; then
    echo "✅ Slack endpoints ready"
else
    echo "⚠️  Slack endpoints not fully ready yet"
fi

# Set up cleanup on exit
trap "echo ''; echo 'Stopping server...'; kill $SERVER_PID 2>/dev/null || true; exit" INT TERM

echo ""
echo "====================================================="
echo "✅ Server is running (PID: $SERVER_PID)"
echo ""
echo "📍 Your Slack endpoints are available at:"
echo "  • https://automation.verygoodplugins.com/slack/events"
echo "  • https://automation.verygoodplugins.com/slack/interactive"  
echo "  • https://automation.verygoodplugins.com/slack/workflow"
echo ""
echo "🎯 Add these URLs to your Slack app configuration"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo "====================================================="
echo ""

# Optional: Start tunnel if requested
if [ "$1" == "--with-tunnel" ]; then
    echo "🌐 Starting Cloudflare tunnel..."
    if [ -f "$PROJECT_ROOT/cloudflare-tunnel/start-tunnel.sh" ]; then
        "$PROJECT_ROOT/cloudflare-tunnel/start-tunnel.sh" &
        TUNNEL_PID=$!
        trap "echo ''; echo 'Stopping server and tunnel...'; kill $SERVER_PID $TUNNEL_PID 2>/dev/null || true; exit" INT TERM
        echo "✅ Tunnel started (PID: $TUNNEL_PID)"
        echo ""
    else
        echo "⚠️  Tunnel script not found. Skipping tunnel start."
    fi
fi

# Keep the script running
wait $SERVER_PID
