#!/bin/bash

# Quick Start Script for Claude Automation Hub + Slack Integration

echo "🚀 Claude Automation Hub - Quick Start"
echo "======================================"
echo ""

# Check if this is first run
if [ ! -f ~/.cloudflared/claude-automation-hub.json ]; then
    echo "⚠️  First time setup detected!"
    echo "Running Cloudflare tunnel setup..."
    echo ""
    cd cloudflare-tunnel
    ./setup-tunnel.sh
    cd ..
else
    echo "✅ Cloudflare tunnel already configured"
fi

# Start the tunnel in background
echo ""
echo "🌐 Starting Cloudflare tunnel..."
cd cloudflare-tunnel
./start-tunnel.sh &
TUNNEL_PID=$!
cd ..

# Give tunnel time to connect
sleep 3

echo ""
echo "✨ Your Slack Integration is Ready!"
echo "===================================="
echo ""
echo "📍 Public Endpoints:"
echo "  • https://automation.verygoodplugins.com"
echo "  • https://automation.verygoodplugins.com/slack/workflow"
echo ""
echo "🔧 Add these to your Slack app:"
echo "  • Event Subscriptions URL"
echo "  • Interactivity URL"
echo "  • Workflow Steps URL"
echo ""
echo "📊 Available Workflow Steps:"
echo "  1. Create WP Fusion Post"
echo "  2. Create VGP Documentation"
echo "  3. Create Support Ticket"
echo "  4. AI Channel Summary"
echo "  5. Save to OpenMemory"
echo "  6. Send Automation Alert"
echo ""
echo "🛑 Press Ctrl+C to stop the tunnel"
echo ""

# Keep running
wait $TUNNEL_PID
