# MCP Configuration Examples

This directory contains example MCP (Model Context Protocol) configurations for different Claude clients.

## Configuration Files

### Cursor IDE Configuration
- **File**: `mcp-cursor.json`
- **Location**: Copy to `.mcp.json` in your project root
- **Features**: Includes workspace-aware tools and development-focused integrations

### Claude Desktop Configuration  
- **File**: `mcp-claude-desktop.json`
- **Location**: Copy to `~/.config/claude-desktop/claude_desktop_config.json` (Linux/macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
- **Features**: System-wide tools and productivity integrations

## Setup Instructions

1. **Choose your configuration** based on your primary Claude client
2. **Replace placeholder values**:
   - `your_api_key_here` → Your actual API keys
   - `your-username` → Your system username
   - `/path/to/your/` → Actual paths to your MCP servers
   - `your-database-name` → Your database name
   - URLs → Your actual service URLs

3. **Install required MCP servers** (see Tool Documentation below)
4. **Restart your Claude client** to load the new configuration

## Security Notes

⚠️ **Never commit real API keys to version control!**

- Use environment variables for sensitive data when possible
- Keep your actual configuration files in secure locations
- Regularly rotate API keys and tokens
- Review permissions for each integration

## Tool Documentation

See the main README.md for detailed information about each MCP tool and their capabilities.
