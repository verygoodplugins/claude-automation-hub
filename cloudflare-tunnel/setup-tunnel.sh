#!/bin/bash

# Cloudflare Tunnel Setup Script for Claude Automation Hub
# Run this once to set up your tunnel

set -e

echo "🚀 Setting up Cloudflare Tunnel for Claude Automation Hub"
echo "=================================================="

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "📦 Installing cloudflared..."
    brew install cloudflared
else
    echo "✅ cloudflared is already installed"
fi

# Login to Cloudflare (you'll need to do this manually)
echo ""
echo "🔐 Authenticating with Cloudflare..."
echo "A browser will open - please log in to your Cloudflare account"
cloudflared tunnel login

# Create the tunnel
echo ""
echo "🏗️ Creating tunnel 'claude-automation-hub'..."
cloudflared tunnel create claude-automation-hub || echo "Tunnel may already exist, continuing..."

# Get tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep claude-automation-hub | awk '{print $1}')
echo "📝 Tunnel ID: $TUNNEL_ID"

# Copy config to cloudflared directory
echo ""
echo "📋 Setting up configuration..."
mkdir -p ~/.cloudflared
cp config.yml ~/.cloudflared/config.yml

# Create DNS record instruction
echo ""
echo "=================================================="
echo "⚠️  MANUAL STEP REQUIRED:"
echo ""
echo "Please add this DNS record in your Cloudflare dashboard:"
echo ""
echo "  Type: CNAME"
echo "  Name: automation"
echo "  Target: $TUNNEL_ID.cfargotunnel.com"
echo "  Proxied: Yes (orange cloud ON)"
echo ""
echo "Domain options:"
echo "  - automation.wpfusion.com"
echo "  - automation.verygoodplugins.com"
echo ""
echo "=================================================="
echo ""
echo "Press Enter after adding the DNS record..."
read

# Test the tunnel
echo "🧪 Testing tunnel connection..."
echo "Starting tunnel in test mode (Ctrl+C to stop)..."
cloudflared tunnel run claude-automation-hub
