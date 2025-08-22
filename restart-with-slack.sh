#!/bin/bash

# Restart the Cursor Web Proxy with Slack support

echo "🔄 Restarting Cursor Web Proxy with Slack Integration"
echo "======================================================"
echo ""

# Find and kill the existing process
echo "1️⃣ Stopping existing server..."
PID=$(lsof -ti :8765)
if [ ! -z "$PID" ]; then
    kill $PID
    echo "✅ Stopped process $PID"
    sleep 2
else
    echo "ℹ️ No existing process found"
fi

# Start the server with the new Slack routes
echo ""
echo "2️⃣ Starting server with Slack support..."
cd /Users/jgarturo/Projects/OpenAI/claude-automation-hub

# Start the server
node src/proxy/cursor-web-proxy.js &
SERVER_PID=$!

# Give it time to start
sleep 2

# Test the endpoints
echo ""
echo "3️⃣ Testing endpoints..."
echo ""

# Test health endpoint
echo "Testing /health:"
curl -s http://localhost:8765/health | python3 -m json.tool || echo "Failed to get health"

echo ""
echo "Testing /slack/events (GET):"
curl -s http://localhost:8765/slack/events | python3 -m json.tool || echo "Failed to get Slack events"

echo ""
echo "✨ Server Restarted Successfully!"
echo "================================="
echo ""
echo "📍 Slack endpoints are now available at:"
echo "  • https://automation.verygoodplugins.com/slack/events"
echo "  • https://automation.verygoodplugins.com/slack/interactive"
echo "  • https://automation.verygoodplugins.com/slack/workflow"
echo ""
echo "🎯 You can now add these URLs to your Slack app!"
echo ""
echo "Server PID: $SERVER_PID"
echo "To stop: kill $SERVER_PID"
