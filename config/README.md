# Claude Configuration Examples 🎯

This directory contains battle-tested configuration examples for Claude Desktop, Claude Code, Cursor IDE, and window management tools.

## 🚀 Quick Start Matrix

| I Want To... | Use This Config | Setup Time | Difficulty |
|--------------|-----------------|------------|------------|
| **Just chat with Claude + basic automation** | `claude-desktop-config-full-example.json` | 15 min | ⭐ Easy |
| **Develop with AI pair programming** | `cursor-mcp-example.json` | 30 min | ⭐⭐ Medium |
| **Use Claude in terminal/CLI** | `claudecode-settings-example.json` | 20 min | ⭐⭐ Medium |
| **Optimize window management** | `yabairc-ai-development.sh` | 45 min | ⭐⭐⭐ Advanced |
| **Everything (Power User)** | All configs | 1-2 hours | ⭐⭐⭐ Advanced |

## 📚 Comprehensive Guides

- **[CONFIGURATION-GUIDE.md](CONFIGURATION-GUIDE.md)** - Complete setup walkthrough
- **[MCP-SERVERS.md](MCP-SERVERS.md)** - All available MCP servers compared

## 📁 Configuration Files

### Cursor IDE Configurations
- **File**: `cursor-mcp-example.json` (NEW - Comprehensive with all MCPs)
- **File**: `mcp-cursor.json` (Original - Basic setup)
- **Location**: Copy to `.mcp.json` in your project root
- **Features**: Includes workspace-aware tools and development-focused integrations

### Claude Desktop Configurations
- **File**: `claude-desktop-config-full-example.json` (NEW - Complete with all MCPs)
- **File**: `claude_desktop_config-example.json` (Original - Basic setup)
- **Location**: Copy to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `~/.config/claude-desktop/claude_desktop_config.json` (Linux) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
- **Features**: System-wide tools and productivity integrations

### Claude Code Settings Configurations
- **File**: `claudecode-settings-example.json` (NEW - Streamlined permissions)
- **File**: `claudecode-settings-local-example.json` (NEW - Project overrides)
- **File**: `claude-settings-example.json` (Original - Comprehensive)
- **Location**: Copy to `~/.claude/settings.json` (global) or `.claude/settings.json` (project-specific)
- **Features**: Permission controls, environment variables, and security settings for Claude Code

### Window Manager Configurations (macOS)
- **Directory**: `yabai/`
- **NEW AI-Focused Configs:**
  - `yabairc-ai-development.sh` - Optimized for Claude + Cursor workflow
  - `skhdrc-ai-development.sh` - AI development keyboard shortcuts
- **Original Configs:**
  - `yabairc-example.sh` - Personal 3-monitor setup
  - `yabairc-minimal.sh` - Simple single monitor setup
  - `skhdrc-example.sh` - Comprehensive shortcuts
  - `skhdrc-popular.sh` - Community favorites
  - `CHEATSHEET.md` - Printable reference card
- **Features**: Tiling window management optimized for development workflows with personalized app rules and smart screenshot workflows
- **Background**: Created by Claude after analyzing actual developer workflow patterns and multi-monitor setup

## ⚡ Setup Instructions

### 🎯 Choose Your Path

#### Path 1: Non-Technical User (WordPress Business Owner)
1. Install [Claude Desktop](https://claude.ai/download)
2. Copy `claude-desktop-config-full-example.json` to config location
3. Add 2-3 MCPs (filesystem, openmemory, wordpress)
4. Start automating!

#### Path 2: Developer (Full Stack)
1. Install [Cursor IDE](https://cursor.com)
2. Copy `cursor-mcp-example.json` to project root as `.mcp.json`
3. Configure development MCPs (postgres, playwright, etc.)
4. Enable AI pair programming!

#### Path 3: Power User (Everything)
1. Install all tools (Claude Desktop, Claude Code, Cursor)
2. Copy all configurations
3. Set up window management (yabai/skhd)
4. Customize for your workflow

### Detailed Configuration Steps

#### Step 1: Choose Your Configuration

```bash
# For Claude Desktop (Recommended for beginners)
cp claude-desktop-config-full-example.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

# For Cursor IDE (Recommended for developers)
cp cursor-mcp-example.json .mcp.json

# For Claude Code CLI (Advanced users)
cp claudecode-settings-example.json ~/.claude/settings.json
```

#### Step 2: Replace Placeholder Values
   - `your_api_key_here` → Your actual API keys
   - `your-username` → Your system username
   - `/path/to/your/` → Actual paths to your MCP servers
   - `your-database-name` → Your database name
   - URLs → Your actual service URLs

#### Step 3: Install Required MCP Servers

```bash
# Essential MCPs (Start here)
npm install -g @modelcontextprotocol/server-filesystem
npm install -g openmemory

# Add more as needed (see MCP-SERVERS.md for complete list)
```

#### Step 4: Restart Your Client
- Claude Desktop: Quit and reopen
- Cursor: Reload window (Cmd+R)
- Claude Code: New terminal session


## 🔒 Security Notes

⚠️ **Never commit real API keys to version control!**

### MCP Configuration Security
- Use environment variables for sensitive data when possible
- Keep your actual configuration files in secure locations
- Regularly rotate API keys and tokens
- Review permissions for each integration

### Claude Code Settings Security
- The example `claude-settings-example.json` includes comprehensive file access restrictions
- Sensitive files (`.env`, `secrets/`, credentials, etc.) are blocked by default
- Dangerous system operations (`sudo`, `rm -rf`, etc.) are denied
- Git operations that could lose data require confirmation
- Review and customize the `deny` list for your specific environment

## 📖 MCP Server Documentation

**See [MCP-SERVERS.md](MCP-SERVERS.md) for complete comparison and selection guide**

### Available MCP Servers

| Server | Description | GitHub Repository |
|--------|-------------|-------------------|
| **Sequential Thinking** | Structured reasoning and thought processes | [mcp-sequential-thinking](https://github.com/modelcontextprotocol/mcp-sequential-thinking) |
| **PostgreSQL** | Database integration and queries | [servers/postgres](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) |
| **Sentry** | Error monitoring and debugging | [mcp-server-sentry](https://github.com/getsentry/mcp-server-sentry) |
| **FreeScout** | Helpdesk and customer support | [mcp-freescout](https://github.com/verygoodplugins/mcp-freescout) |
| **Playwright** | Browser automation and testing | [playwright-mcp](https://github.com/microsoft/playwright-mcp) |
| **WordPress** | Content management and publishing | [mcp-wp](https://github.com/verygoodplugins/mcp-wp) |
| **OpenMemory** | Persistent memory system | [openmemory](https://github.com/agentops-ai/openmemory) |
| **Context7** | Documentation and code context | [context7-mcp](https://github.com/upstash/context7-mcp) |
| **Browser Tools** | Web automation and testing | [browser-tools-mcp](https://github.com/agentdeskai/browser-tools-mcp) |
| **Slack** | Workspace integration | [slack-mcp-server](https://github.com/mark3labs/slack-mcp-server) |
| **Fly.io** | Deployment and management | [mcp-server-flyio](https://github.com/fly-apps/mcp-server-flyio) |
| **WhatsApp** | Messaging integration | [whatsapp-mcp-server](https://github.com/pchunduri6/whatsapp-mcp-server) |
| **Apple Reminders** | macOS Reminders app | [servers/apple-reminders](https://github.com/modelcontextprotocol/servers/tree/main/src/apple-reminders) |

### Installation Notes

Most servers can be installed via npm/npx, but some require specific setup:
- **Sequential Thinking**: Requires Python and `uv` package manager
- **WordPress**: Requires building from source
- **WhatsApp**: Requires Python and `uv` package manager
- **Apple Reminders**: macOS only, requires system permissions

## 🏆 Recommended Configurations by Role

### WordPress Developer/Agency
```json
// Start with these MCPs
"filesystem", "wordpress", "freescout", "openmemory"
```

### SaaS Developer
```json
// Essential MCPs
"filesystem", "postgres", "stripe", "sentry", "playwright"
```

### Content Creator
```json
// Productivity MCPs
"filesystem", "gmail", "wordpress", "openmemory"
```

### DevOps Engineer
```json
// Infrastructure MCPs
"filesystem", "flyctl", "sentry", "postgres", "slack"
```

## 📚 Additional Resources

- **[Main README](../README.md)** - Project overview and quick start
- **[Workflow Library](../workflows/)** - Pre-built automation workflows
- **[Troubleshooting](../docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Testing Guide](../docs/TESTING-GUIDE.md)** - How to test your setup

---

Built with 🧡 by [Very Good Plugins](https://verygoodplugins.com) for the open source community
