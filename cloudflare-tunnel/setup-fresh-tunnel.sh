#!/bin/bash

# Fresh Cloudflare Tunnel Setup Script
# This creates a new tunnel from scratch with proper configuration

set -e

echo "🔧 Cloudflare Tunnel Fresh Setup"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}❌ cloudflared is not installed${NC}"
    echo -e "${YELLOW}Install it with: brew install cloudflared${NC}"
    exit 1
fi

echo -e "${GREEN}✅ cloudflared is installed${NC}"
echo ""

# Step 1: Login to Cloudflare
echo -e "${BLUE}Step 1: Authenticate with Cloudflare${NC}"
echo "This will open your browser to authenticate..."
echo ""
cloudflared tunnel login

echo ""
echo -e "${GREEN}✅ Authentication complete${NC}"
echo ""

# Step 2: Create the tunnel
TUNNEL_NAME="claude-slack-automation"
echo -e "${BLUE}Step 2: Creating tunnel '${TUNNEL_NAME}'${NC}"

# Check if tunnel already exists
if cloudflared tunnel list | grep -q "$TUNNEL_NAME"; then
    echo -e "${YELLOW}⚠️  Tunnel '$TUNNEL_NAME' already exists${NC}"
    read -p "Delete and recreate it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deleting existing tunnel..."
        cloudflared tunnel delete "$TUNNEL_NAME" --force
    else
        echo "Using existing tunnel"
    fi
fi

# Create the tunnel
cloudflared tunnel create "$TUNNEL_NAME"

echo ""
echo -e "${GREEN}✅ Tunnel created${NC}"
echo ""

# Step 3: Route DNS
echo -e "${BLUE}Step 3: Routing DNS${NC}"
echo "Adding route for automation.verygoodplugins.com..."

# Route the domain to the tunnel
cloudflared tunnel route dns "$TUNNEL_NAME" automation.verygoodplugins.com || {
    echo -e "${YELLOW}⚠️  DNS route may already exist or you may not have access${NC}"
    echo "You may need to add the DNS record manually in Cloudflare dashboard:"
    echo ""
    TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
    echo "Type: CNAME"
    echo "Name: automation"
    echo "Target: ${TUNNEL_ID}.cfargotunnel.com"
    echo ""
}

echo ""
echo -e "${GREEN}✅ DNS routing configured${NC}"
echo ""

# Step 4: Verify configuration
echo -e "${BLUE}Step 4: Verifying configuration${NC}"

# Check if config file exists
if [ -f ~/.cloudflared/config.yml ]; then
    echo -e "${GREEN}✅ config.yml exists${NC}"
    echo ""
    echo "Configuration summary:"
    echo "----------------------"
    grep -E "tunnel:|hostname:|path:" ~/.cloudflared/config.yml | head -20
else
    echo -e "${RED}❌ config.yml not found${NC}"
    echo "Creating default config..."
    exit 1
fi

echo ""
echo "================================="
echo -e "${GREEN}✅ Tunnel setup complete!${NC}"
echo "================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start your local server:"
echo -e "   ${BLUE}node src/proxy/cursor-web-proxy.js${NC}"
echo ""
echo "2. Start the tunnel:"
echo -e "   ${BLUE}./cloudflare-tunnel/start-tunnel.sh${NC}"
echo ""
echo "3. Test the endpoints:"
echo -e "   ${BLUE}curl https://automation.verygoodplugins.com/health${NC}"
echo -e "   ${BLUE}curl -X POST https://automation.verygoodplugins.com/slack/commands -d 'test=1'${NC}"
echo ""
echo "4. Configure your Slack app with these URLs:"
echo "   • Event Subscriptions: https://automation.verygoodplugins.com/slack/events"
echo "   • Slash Commands: https://automation.verygoodplugins.com/slack/commands"
echo "   • Interactivity: https://automation.verygoodplugins.com/slack/interactive"
echo ""
echo "================================="