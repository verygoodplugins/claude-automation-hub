#!/bin/bash

# Start the server properly with Slack support

echo "🚀 Starting Cursor Web Proxy with Slack Integration"
echo "===================================================="
echo ""

# Kill any existing process on port 8765
PID=$(lsof -ti :8765)
if [ ! -z "$PID" ]; then
    echo "Stopping existing process $PID..."
    kill $PID
    sleep 2
fi

# Navigate to project directory
cd /Users/jgarturo/Projects/OpenAI/claude-automation-hub

# Start the server
echo "Starting server..."
node src/proxy/cursor-web-proxy.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test the endpoints
echo ""
echo "Testing endpoints..."
echo "==================="
echo ""

# Test health
echo "1. Health check:"
curl -s http://localhost:8765/health | python3 -m json.tool 2>/dev/null || echo "Health check failed"

echo ""
echo "2. Slack events endpoint:"
curl -s http://localhost:8765/slack/events 2>/dev/null || echo "Slack endpoint not ready"

echo ""
echo "===================================================="
echo "✅ Server is running on PID: $SERVER_PID"
echo ""
echo "📍 Your Slack endpoints are ready at:"
echo "  • https://automation.verygoodplugins.com/slack/events"
echo "  • https://automation.verygoodplugins.com/slack/interactive"  
echo "  • https://automation.verygoodplugins.com/slack/workflow"
echo ""
echo "🎯 Go back to Slack and enter:"
echo "   https://automation.verygoodplugins.com/slack/events"
echo ""
echo "To stop server: kill $SERVER_PID"
echo "===================================================="
