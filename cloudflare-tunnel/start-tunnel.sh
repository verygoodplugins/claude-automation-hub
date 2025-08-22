#!/bin/bash

# Start Cloudflare Tunnel for Claude Automation Hub

echo "🚀 Starting Cloudflare Tunnel..."
echo "================================"
echo "Your automation hub will be available at:"
echo "  https://automation.verygoodplugins.com"
echo ""
echo "Slack webhook endpoints:"
echo "  https://automation.verygoodplugins.com/slack/events"
echo "  https://automation.verygoodplugins.com/slack/interactive"
echo "  https://automation.verygoodplugins.com/slack/workflow"
echo ""
echo "Press Ctrl+C to stop the tunnel"
echo "================================"

# Run the tunnel
cloudflared tunnel run claude-automation-hub
