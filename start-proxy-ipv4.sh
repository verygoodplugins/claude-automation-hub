#!/bin/bash
# Temporary workaround to force IPv4 binding

echo "🔧 Starting proxy with IPv4 binding workaround..."

# Kill any existing proxy
pkill -f cursor-web-proxy

# Use socat to forward IPv4 to IPv6 if available
if command -v socat &> /dev/null; then
    echo "📡 Setting up IPv4 → IPv6 forwarding..."
    socat TCP4-LISTEN:8765,fork TCP6:[::1]:8765 &
    echo "✅ IPv4 forwarding enabled"
else
    echo "⚠️  Install socat for IPv4 support: brew install socat"
fi

# Start the proxy normally
cd "$(dirname "$0")"
node cursor-web-proxy.js
