# Claude Configuration Examples

This directory contains configuration examples for Claude clients including MCP (Model Context Protocol) server configurations and Claude Code settings.

## Configuration Files

### Cursor IDE Configuration
- **File**: `mcp-cursor.json`
- **Location**: Copy to `.mcp.json` in your project root
- **Features**: Includes workspace-aware tools and development-focused integrations

### Claude Desktop Configuration  
- **File**: `claude_desktop_config-example.json`
- **Location**: Copy to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `~/.config/claude-desktop/claude_desktop_config.json` (Linux) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
- **Features**: System-wide tools and productivity integrations

### Claude Code Settings Configuration
- **File**: `claude-settings-example.json`
- **Location**: Copy to `~/.claude/settings.json` (global) or `.claude/settings.json` (project-specific)
- **Features**: Permission controls, environment variables, and security settings for Claude Code

## Setup Instructions

### MCP Server Configuration

1. **Choose your MCP configuration** based on your primary Claude client:
   ```bash
   # For Cursor IDE
   cp mcp-cursor.json .mcp.json
   
   # For Claude Desktop (macOS)
   cp claude_desktop_config-example.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Replace placeholder values**:
   - `your_api_key_here` → Your actual API keys
   - `your-username` → Your system username
   - `/path/to/your/` → Actual paths to your MCP servers
   - `your-database-name` → Your database name
   - URLs → Your actual service URLs

3. **Install required MCP servers** (see MCP Server Documentation below)
4. **Restart your Claude client** to load the new configuration

### Claude Code Settings Configuration

1. **Copy the example settings file**:
   ```bash
   # For global settings (applies to all projects)
   cp claude-settings-example.json ~/.claude/settings.json
   
   # For project-specific settings
   mkdir -p .claude
   cp claude-settings-example.json .claude/settings.json
   ```

2. **Customize permissions** based on your needs:
   - **`allow` list includes:**
     - Core file operations: Edit, Write, MultiEdit, Read
     - Package managers: composer, npm, yarn, pnpm, bun
     - Build tools: gulp, webpack, vite, rollup
     - PHP tools: phpunit, phpcs, phpcbf, phpstan
     - Version control: git operations
     - WordPress CLI: wp commands
     - System utilities: find, grep, ls, cat, etc.
     - Network tools: curl, wget, ping, dig
     - Text processing: jq, yq, awk, sed, etc.
     - GitHub CLI: gh commands
     - Archive tools: tar, zip, gzip, etc.
   - **`deny` list blocks:**
     - Dangerous system operations: sudo, rm -rf, fdisk
     - System modification: systemctl, mount, crontab
     - Network security tools: netcat, nmap
     - Sensitive files: .env, secrets/, SSH keys, credentials
     - Destructive git operations: reset --hard, clean -fd
   - **`ask` list requires confirmation for:**
     - Git push operations and rebases
     - Package publishing commands
     - Editing important config files

3. **Configure environment variables**:
   - Adjust timeout values based on your typical command execution times
   - Enable/disable telemetry and cost warnings as preferred

4. **Settings hierarchy** (highest to lowest precedence):
   - Enterprise managed policies
   - Command line arguments
   - Local project settings (`.claude/settings.local.json`)
   - Shared project settings (`.claude/settings.json`)
   - User settings (`~/.claude/settings.json`)

For more detailed configuration options, see the [official Claude Code settings documentation](https://docs.anthropic.com/en/docs/claude-code/settings).

## Security Notes

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

## MCP Server Documentation

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

## Tool Documentation

See the main README.md for detailed information about each MCP tool and their capabilities.
