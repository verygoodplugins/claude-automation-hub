#!/bin/bash

# Setup script for npx-for-claude wrapper
# This fixes Node.js version issues with Claude Desktop MCP servers

echo "🔧 Setting up npx-for-claude wrapper..."

# Create the wrapper script content
cat > /tmp/npx-for-claude << 'EOF'
#!/bin/zsh

# Load NVM and shell configuration to ensure correct Node.js version
source ~/.zshrc

# If NVM is available, use the default or current Node version
if command -v nvm &> /dev/null; then
    # Use nvm's current version
    nvm use default &> /dev/null || nvm use node &> /dev/null || true
fi

# Execute npx with all passed arguments
exec npx "$@"
EOF

# Install the wrapper script (requires sudo)
echo "📝 Installing npx-for-claude to /usr/local/bin/ (requires sudo)..."
sudo cp /tmp/npx-for-claude /usr/local/bin/npx-for-claude
sudo chmod +x /usr/local/bin/npx-for-claude

# Clean up temp file
rm /tmp/npx-for-claude

# Verify installation
if [ -x "/usr/local/bin/npx-for-claude" ]; then
    echo "✅ npx-for-claude installed successfully!"
    echo ""
    echo "🔍 Testing Node.js version detection..."
    /usr/local/bin/npx-for-claude --version
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your Claude Desktop config to use 'npx-for-claude' instead of 'npx'"
    echo "2. Restart Claude Desktop to apply changes"
    echo ""
    echo "Example config change:"
    echo '  "command": "npx-for-claude",'
    echo '  "args": ["-y", "your-mcp-package"]'
else
    echo "❌ Installation failed. Please check permissions and try again."
    exit 1
fi
