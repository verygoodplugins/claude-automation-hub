#!/bin/bash

echo "🤖 Setting up Claude Automation Hub with MCP Reloader..."

# Create tools directory if it doesn't exist
mkdir -p tools

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if mcp.json exists in cursor directory
MCP_CONFIG="$HOME/.cursor/mcp.json"

echo "🔧 MCP Configuration Setup"
echo "Add this configuration to your $MCP_CONFIG file:"
echo ""
echo "{"
echo '  "mcpServers": {'
echo '    "claude-automation-hub": {'
echo '      "command": "node",'
echo '      "args": ["node_modules/mcp-reloader/dist/index.js"],'
echo "      \"cwd\": \"$(pwd)\","
echo '      "autostart": true'
echo '    }'
echo '  }'
echo "}"
echo ""
echo "💡 Or run: cat mcp-config-update.md for detailed instructions"
echo ""
echo "🚀 After updating your MCP config:"
echo "1. Restart Claude Desktop/Cursor"
echo "2. Test with: 'Use the test_mcp_reloader tool'"
echo "3. Create new tools in ./tools/ directory"
echo "4. Tools are hot-reloaded automatically!"
echo ""
echo "✅ Setup complete! Happy automating!"
