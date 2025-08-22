#!/bin/bash

# QUICK FIX: Start everything needed for Slack integration

echo "🔧 Quick Fix for Slack Integration"
echo "=================================="
echo ""

# Step 1: Start the webhook server
echo "1️⃣ Starting webhook server on port 8765..."
if command -v node &> /dev/null; then
    # Check if express is installed
    if [ ! -d "node_modules/express" ]; then
        echo "📦 Installing Express..."
        npm install express
    fi
    
    # Start the server in background
    node simple-webhook-server.js &
    SERVER_PID=$!
    echo "✅ Server started (PID: $SERVER_PID)"
else
    echo "❌ Node.js not found. Please install Node.js first"
    exit 1
fi

# Give server time to start
sleep 2

# Step 2: Start the Cloudflare tunnel
echo ""
echo "2️⃣ Starting Cloudflare tunnel..."
echo "Using credentials: /Users/jgarturo/.cloudflared/13e37322-d0c0-408e-9721-56db2b655b24.json"

# Update the config with correct credentials
cat > ~/.cloudflared/config.yml << EOF
tunnel: claude-automation-hub
credentials-file: /Users/jgarturo/.cloudflared/13e37322-d0c0-408e-9721-56db2b655b24.json

ingress:
  - hostname: automation.verygoodplugins.com
    service: http://localhost:8765
  - service: http_status:404
EOF

# Run the tunnel
cloudflared tunnel run claude-automation-hub &
TUNNEL_PID=$!

echo "✅ Tunnel started (PID: $TUNNEL_PID)"

# Step 3: Show status
echo ""
echo "✨ Everything is running!"
echo "========================"
echo ""
echo "📍 Your Slack endpoints are ready at:"
echo "  • https://automation.verygoodplugins.com/slack/events"
echo "  • https://automation.verygoodplugins.com/slack/interactive"
echo "  • https://automation.verygoodplugins.com/slack/workflow"
echo ""
echo "🧪 Test the connection:"
echo "  curl https://automation.verygoodplugins.com/health"
echo ""
echo "⚠️  Make sure you added the DNS record:"
echo "  Type: CNAME"
echo "  Name: automation"
echo "  Target: 13e37322-d0c0-408e-9721-56db2b655b24.cfargotunnel.com"
echo ""
echo "🛑 Press Ctrl+C to stop everything"
echo ""

# Wait and cleanup on exit
trap "echo 'Stopping...'; kill $SERVER_PID $TUNNEL_PID 2>/dev/null; exit" INT
wait
