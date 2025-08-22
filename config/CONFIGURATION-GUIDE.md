# Claude Automation Hub Configuration Guide 🛠️

This guide helps you choose and configure the right tools for your AI automation workflow.

## Quick Start: Which Configuration Do I Need?

### 🎯 Choose Your Path

| User Type | Recommended Setup | Config Files | Time to Setup |
|-----------|------------------|--------------|---------------|
| **Beginner** | Claude Desktop + Basic MCPs | `claude-desktop-config-full-example.json` | 15 minutes |
| **WordPress Developer** | Claude Code + WordPress MCPs | `claudecode-settings-example.json` + WordPress MCPs | 30 minutes |
| **Full Stack Developer** | Cursor IDE + All Dev MCPs | `cursor-mcp-example.json` + dev tools | 45 minutes |
| **Power User** | Everything + Custom Tools | All configs + `automation-hub` | 1 hour |

## Configuration Files Overview

### 1. Claude Desktop Configuration
**File:** `claude-desktop-config-full-example.json`
**Purpose:** System-wide MCP servers for Claude Desktop app
**Best For:** Non-technical users, business owners, content creators

### 2. Claude Code Settings
**Files:** `claudecode-settings-example.json`, `claudecode-settings-local-example.json`
**Purpose:** Permissions and security for Claude Code CLI
**Best For:** Developers who use terminal/command line

### 3. Cursor IDE Configuration
**File:** `cursor-mcp-example.json`
**Purpose:** Development-focused MCPs for Cursor IDE
**Best For:** Software developers, AI pair programming

### 4. Window Management (macOS)
**Files:** `yabairc-ai-development.sh`, `skhdrc-ai-development.sh`
**Purpose:** Automatic window tiling and keyboard shortcuts
**Best For:** Power users who want keyboard-driven workflows

## Step-by-Step Setup Guide

### Step 1: Choose Your Primary Tool

#### Option A: Claude Desktop (Easiest)
```bash
# Copy the configuration
cp config/claude-desktop-config-full-example.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Edit with your values
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### Option B: Claude Code (For Developers)
```bash
# Global settings
cp config/claudecode-settings-example.json ~/.claude/settings.json

# Project settings (optional)
cp config/claudecode-settings-local-example.json .claude/settings.json
```

#### Option C: Cursor IDE (Advanced)
```bash
# Copy to project root
cp config/cursor-mcp-example.json .mcp.json

# Or to Cursor's config directory
cp config/cursor-mcp-example.json ~/.cursor/mcp.json
```

### Step 2: Select Your MCP Servers

#### Starter Pack (3 Essential MCPs)
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/Documents"]
    },
    "openmemory": {
      "command": "npx",
      "args": ["-y", "openmemory"],
      "env": {
        "OPENMEMORY_API_KEY": "your-key-here"
      }
    },
    "automation-hub": {
      "command": "node",
      "args": ["./node_modules/mcp-reloader/dist/server.js"]
    }
  }
}
```

#### WordPress Pack
Add these for WordPress development:
```json
"wordpress": {
  "command": "node",
  "args": ["/path/to/mcp-wp/build/server.js"],
  "env": {
    "WORDPRESS_API_URL": "https://your-site.com",
    "WORDPRESS_USERNAME": "your-username",
    "WORDPRESS_PASSWORD": "your-app-password"
  }
},
"freescout": {
  "command": "npx",
  "args": ["@verygoodplugins/mcp-freescout@latest"],
  "env": {
    "FREESCOUT_URL": "https://support.your-site.com",
    "FREESCOUT_API_KEY": "your-api-key"
  }
}
```

#### Developer Pack
Add these for software development:
```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/dbname"]
},
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
},
"playwright": {
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```

### Step 3: Configure Security Settings

#### Basic Permissions (Safe)
```json
{
  "permissions": {
    "allow": [
      "Edit", "Write", "Read",
      "Bash(git:*)", "Bash(npm:*)", "Bash(ls:*)",
      "WebFetch", "WebSearch"
    ],
    "deny": [
      "Bash(sudo:*)", "Bash(rm -rf /*)"
    ],
    "ask": [
      "Bash(git push:*)"
    ]
  }
}
```

#### Advanced Permissions (More Freedom)
See `claudecode-settings-example.json` for comprehensive permissions.

### Step 4: Test Your Configuration

#### Test Claude Desktop
1. Restart Claude Desktop
2. Type: "What MCP tools are available?"
3. Claude should list your configured servers

#### Test Claude Code
```bash
# Check settings loaded
claude --version

# Test with a simple command
claude "List files in current directory"
```

#### Test Cursor IDE
1. Open Cursor
2. Check MCP panel (View → MCP Servers)
3. Green dots = connected

## Configuration Comparison

| Feature | Claude Desktop | Claude Code | Cursor IDE |
|---------|---------------|-------------|------------|
| **GUI Interface** | ✅ Yes | ❌ Terminal | ✅ Yes |
| **MCP Support** | ✅ Full | ✅ Full | ✅ Full |
| **Project-Specific Config** | ❌ No | ✅ Yes | ✅ Yes |
| **Hot Reload** | ❌ No | ✅ Yes | ✅ Yes |
| **Multi-File Editing** | ❌ Limited | ✅ Yes | ✅ Yes |
| **Git Integration** | ❌ No | ✅ Yes | ✅ Yes |
| **Best For** | Chat & Simple Tasks | Command Line Power | Full Development |

## Troubleshooting Common Issues

### MCP Server Not Connecting
```bash
# Check if npx works
npx --version

# Test MCP directly
npx -y @modelcontextprotocol/server-filesystem ~/Documents

# Check logs
tail -f ~/Library/Logs/Claude/mcp-*.log
```

### Permission Denied Errors
- Check your `permissions` block in settings
- Add the specific command to `allow` list
- Restart Claude after changing permissions

### API Key Issues
- Never commit real API keys
- Use environment variables when possible
- Store keys in secure password manager

## Security Best Practices

### 1. API Key Management
```bash
# Use environment variables
export OPENMEMORY_API_KEY="your-key"

# Or use a .env file (don't commit!)
echo "OPENMEMORY_API_KEY=your-key" >> .env
```

### 2. Permission Scoping
- Start with minimal permissions
- Add permissions as needed
- Review permissions monthly

### 3. Project Isolation
- Use `.claude/settings.local.json` for project-specific settings
- Don't mix personal and work configurations
- Keep sensitive projects separate

## Next Steps

1. **Start Simple:** Begin with 2-3 MCP servers
2. **Test Workflows:** Try the examples in `/workflows`
3. **Customize:** Modify configs for your needs
4. **Share:** Contribute your configurations back!

## Need Help?

- Check `/docs/TROUBLESHOOTING.md` for common issues
- Review individual MCP documentation in `/config/MCP-SERVERS.md`
- Open an issue on GitHub for support

---

Built with 🧡 by [Very Good Plugins](https://verygoodplugins.com) for the open source community