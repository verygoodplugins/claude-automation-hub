# MCP Server Setup Guide

This guide explains how to configure MCP (Model Context Protocol) servers for both Claude Desktop and Cursor IDE.

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** and add your credentials for each service you want to use

3. **Test your configuration:**
   ```bash
   node test-mcp-env.js
   ```

## How It Works

### Environment Variable Expansion

The `.mcp.json` file uses `${VAR}` syntax to reference environment variables:
```json
"env": {
  "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
}
```

### For Claude Desktop
Claude Desktop natively supports `${VAR}` expansion from your system environment variables. 

**To make .env variables available to Claude Desktop:**
- On macOS: Use the launch script: `./launch-claude.sh`
- Or manually: `source .env && open -a "Claude"`

### For Cursor IDE
Cursor reads the `.env` file directly thanks to `.cursorignore` containing `!.env`.

## Required Credentials

### Slack Integration
- **Bot Token**: Get from https://api.slack.com/apps → OAuth & Permissions
- **User Token**: Same page, different token starting with `xoxp-`

### GitHub
- **Personal Access Token**: Create at https://github.com/settings/tokens
- Required scopes: `repo`, `read:org`, `workflow`

### FreeScout
- **API Key**: Get from your FreeScout instance → Settings → API
- **URL**: Your FreeScout installation URL

### Brave Search
- **API Key**: Sign up at https://brave.com/search/api/

### WordPress Sites
- **Application Passwords**: Generate from WordPress → Users → Profile → Application Passwords
- Keep passwords in quotes if they contain spaces

## Testing Your Setup

Run the test script to verify all environment variables are set:
```bash
node test-mcp-env.js
```

You should see ✅ for each configured service.

## Troubleshooting

### "Missing environment variables" warning
- Make sure you've copied `.env.example` to `.env`
- Verify all required variables are set in `.env`
- For Claude Desktop: Restart after setting environment variables
- For Cursor: Ensure `.cursorignore` exists with `!.env`

### MCP server fails to start
- Check the specific service credentials are correct
- Run `node test-mcp-env.js` to verify variables are loaded
- Check logs in Claude Desktop → Settings → Developer

## Optional Services

You can remove any MCP servers you don't need from `.mcp.json`. Common ones to remove:
- `wordpress-wpfusion` and `wordpress-verygoodplugins` if you don't manage these sites
- `brave-search` if you don't need web search
- `slack-tools` if you don't use Slack

## Security Notes

- Never commit `.env` file (it's in `.gitignore`)
- Use `.env.example` as a template for sharing
- Rotate API keys regularly
- Use application-specific passwords where available