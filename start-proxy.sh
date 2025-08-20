#!/bin/bash
# Quick Start Script for Cursor Web Proxy v2

echo "🚀 Starting Cursor Web Proxy v2..."
echo ""

# Kill any existing proxy on port 8765
lsof -ti:8765 | xargs kill -9 2>/dev/null

# Start the new proxy
cd "$(dirname "$0")"
node cursor-web-proxy-v2.js &

echo ""
echo "✅ Proxy started!"
echo ""
echo "📍 Dashboard: http://localhost:8765/dashboard"
echo "📍 Health: http://localhost:8765/health"
echo ""
echo "🔗 Links generated here will work in:"
echo "  • Claude Desktop (clickable)"
echo "  • Email clients"
echo "  • Web browsers"
echo "  • Any HTML context"
echo ""
echo "Press Ctrl+C to stop the proxy"

# Keep script running
wait
