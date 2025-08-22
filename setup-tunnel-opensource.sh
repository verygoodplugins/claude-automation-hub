#!/bin/bash

# Open Source Cloudflare Tunnel Setup for Claude Automation Hub
# This script handles the credential file mismatch automatically

set -e

echo "🚀 Claude Automation Hub - Cloudflare Tunnel Setup"
echo "=================================================="
echo ""

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded configuration from .env"
else
    echo "📝 No .env file found. Creating from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your settings and run this script again"
    exit 1
fi

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "📦 Installing cloudflared..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install cloudflared
    else
        echo "Please install cloudflared manually: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation"
        exit 1
    fi
else
    echo "✅ cloudflared is already installed"
fi

# Check if tunnel already exists
EXISTING_TUNNEL=$(cloudflared tunnel list 2>/dev/null | grep "${TUNNEL_NAME:-claude-automation-hub}" || true)

if [ -z "$EXISTING_TUNNEL" ]; then
    echo ""
    echo "🔐 Creating new tunnel..."
    echo "A browser will open for authentication"
    cloudflared tunnel login
    
    echo ""
    echo "🏗️ Creating tunnel '${TUNNEL_NAME:-claude-automation-hub}'..."
    cloudflared tunnel create "${TUNNEL_NAME:-claude-automation-hub}"
    
    # Get the credentials file that was created
    TUNNEL_ID=$(cloudflared tunnel list | grep "${TUNNEL_NAME:-claude-automation-hub}" | awk '{print $1}')
    CRED_FILE="$HOME/.cloudflared/${TUNNEL_ID}.json"
    
    echo "📝 Tunnel created with ID: $TUNNEL_ID"
    echo "📁 Credentials saved to: $CRED_FILE"
    
    # Update .env with the correct credentials file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|TUNNEL_CREDENTIALS_FILE=.*|TUNNEL_CREDENTIALS_FILE=${CRED_FILE}|" .env
    else
        sed -i "s|TUNNEL_CREDENTIALS_FILE=.*|TUNNEL_CREDENTIALS_FILE=${CRED_FILE}|" .env
    fi
    
    echo "✅ Updated .env with credentials path"
else
    echo "✅ Tunnel '${TUNNEL_NAME:-claude-automation-hub}' already exists"
    TUNNEL_ID=$(echo "$EXISTING_TUNNEL" | awk '{print $1}')
    CRED_FILE="$HOME/.cloudflared/${TUNNEL_ID}.json"
fi

# Generate dynamic config.yml with environment variables
echo ""
echo "📋 Generating tunnel configuration..."
cat > cloudflare-tunnel/config.yml << EOF
# Auto-generated Cloudflare Tunnel Configuration
# Generated on $(date)

tunnel: ${TUNNEL_NAME:-claude-automation-hub}
credentials-file: ${CRED_FILE}

ingress:
  # Main automation hub endpoint
  - hostname: ${TUNNEL_DOMAIN:-automation.verygoodplugins.com}
    service: http://${SERVER_HOST:-localhost}:${SERVER_PORT:-8765}
    
  # Slack webhook endpoints
  - hostname: ${TUNNEL_DOMAIN:-automation.verygoodplugins.com}
    path: /slack/*
    service: http://${SERVER_HOST:-localhost}:${SERVER_PORT:-8765}
    
  # Health check endpoint
  - hostname: ${TUNNEL_DOMAIN:-automation.verygoodplugins.com}
    path: /health
    service: http://${SERVER_HOST:-localhost}:${SERVER_PORT:-8765}
    
  # Catch-all rule (required)
  - service: http_status:404
EOF

echo "✅ Configuration generated"

# Copy config to cloudflared directory
cp cloudflare-tunnel/config.yml ~/.cloudflared/config.yml

# Display DNS instructions
echo ""
echo "=================================================="
echo "⚠️  MANUAL STEP REQUIRED:"
echo ""
echo "Add this DNS record in your Cloudflare dashboard:"
echo ""
echo "  Type: CNAME"
echo "  Name: $(echo ${TUNNEL_DOMAIN:-automation.verygoodplugins.com} | cut -d'.' -f1)"
echo "  Target: ${TUNNEL_ID}.cfargotunnel.com"
echo "  Proxied: Yes (orange cloud ON)"
echo ""
echo "  Full URL will be: https://${TUNNEL_DOMAIN:-automation.verygoodplugins.com}"
echo ""
echo "=================================================="
echo ""
echo "After adding the DNS record, you can start the tunnel with:"
echo "  ./start-tunnel.sh"
echo ""
echo "Or test it now with:"
echo "  cloudflared tunnel run ${TUNNEL_NAME:-claude-automation-hub}"
