# Slack Integration Guide

## Overview

The Claude Automation Hub includes a complete Slack integration that enables AI-powered automation directly from your Slack workspace. This integration connects your local MCP servers to Slack through a secure Cloudflare tunnel.

> **Important: Multiple Token Types!**  
> Slack uses different token types for different purposes:
> - **Bot Token (xoxb-)**: Required for views.publish, home tabs, and bot operations
> - **User Token (xoxp-)**: Required for MCP Slack server, user-level operations, and search
> 
> ✅ **Note:** The MCP Slack server supports User OAuth tokens directly! See [Token Guide](./SLACK-TOKEN-GUIDE.md) for setup.

## Architecture

```
Slack App → Cloudflare Tunnel → Local Server (port 8765) → MCP Tools → Claude AI
```

## Features

### Implemented
- ✅ Event subscriptions (messages, mentions, reactions)
- ✅ Slash commands (`/claude`)
- ✅ Interactive components (buttons, shortcuts)
- ✅ Link unfurling for your domains
- ✅ Workflow steps for automation
- ✅ Secure request signature verification

### Ready for Integration
- 🔧 FreeScout ticket creation from messages
- 🔧 WordPress content management
- 🔧 OpenMemory context storage
- 🔧 Claude AI responses

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Cloudflare account (free tier works)
- Slack workspace with admin permissions
- MCP servers configured in Claude Desktop/Cursor

### 2. Environment Configuration

Create a `.env` file with your Slack app credentials:

```env
# Slack App Credentials (BOTH tokens required!)
SLACK_SIGNING_SECRET=your_signing_secret_here
SLACK_BOT_TOKEN=xoxb-your-bot-token    # Required for views.publish and Slack API
SLACK_USER_TOKEN=xoxp-your-user-token  # Required for MCP operations

# Optional: Enable debug logging
NODE_ENV=development
```

### 3. Cloudflare Tunnel Setup

The tunnel exposes your local server to Slack webhooks:

```bash
# Install Cloudflare tunnel
brew install cloudflared

# Configure tunnel (already done in cloudflare-tunnel/config.yml)
cd cloudflare-tunnel
./setup-tunnel.sh

# Start tunnel
./start-tunnel.sh
```

### 4. Start the Server

```bash
cd ~/Projects/OpenAI/claude-automation-hub
node src/proxy/cursor-web-proxy.js
```

The server runs on port 8765 and handles both Cursor proxy and Slack webhooks.

### 5. Configure Slack App

In your Slack app settings (https://api.slack.com/apps):

#### Event Subscriptions
- Request URL: `https://your-domain.com/slack/events`
- Subscribe to bot events:
  - `app_mention`
  - `message.channels`
  - `message.im`
  - `link_shared`

#### Interactivity & Shortcuts
- Request URL: `https://your-domain.com/slack/interactive`
- Create shortcuts:
  - "Summarize with AI" → `summarize_message`
  - "Create Ticket" → `create_ticket_from_message`
  - "Save to Memory" → `save_message_to_memory`

#### Slash Commands
- Command: `/claude`
- Request URL: `https://your-domain.com/slack/commands`
- Description: "Chat with Claude AI"
- Usage Hint: `[your question or request]`

#### OAuth & Permissions
**Important:** Both tokens are required with different scopes.

Required bot token scopes (for views.publish and Slack API):
- `chat:write`
- `commands`
- `im:history`
- `channels:history`
- `links:read`
- `links:write`
- `users:read`

## Usage Examples

### Slash Command
```
/claude What are the latest support tickets?
```

### Message Shortcuts
Right-click any message → Apps → "Summarize with AI"

### Direct Messages
DM the bot directly for private AI conversations

### Link Unfurling
Post a link to your domain and get automatic previews

## MCP Integration Points

The server includes placeholder comments for MCP integration:

```javascript
// Example: FreeScout ticket creation
case 'create_ticket_from_message':
  // TODO: Call FreeScout MCP
  // const ticket = await mcp.freescout.createTicket({
  //   customer_email: message.user_email,
  //   subject: 'Ticket from Slack',
  //   message: message.text
  // });
  break;
```

## Security

### Request Verification
All Slack requests are verified using HMAC-SHA256 signatures:
- Signature validation prevents unauthorized requests
- Timestamp checking prevents replay attacks
- Automatic bypass in development mode for testing

### Environment Isolation
- Server only accepts localhost connections by default
- Cloudflare tunnel provides secure external access
- Tokens stored in environment variables, not in code

## Troubleshooting

### Home Tab Shows "invalid_arguments" Error
This usually means the user ID is incorrect. To find your correct user ID:
```bash
node scripts/slack-get-user-id.js
```
This will show your workspace users and identify your user ID.

### Server Not Receiving Events
1. Check tunnel is running: `ps aux | grep cloudflared`
2. Verify DNS: `nslookup your-domain.com`
3. Test endpoint: `curl https://your-domain.com/health`

### Signature Verification Failures
1. Ensure `SLACK_SIGNING_SECRET` is correct in `.env`
2. Check server is loading environment variables
3. Verify request timestamps are synchronized

### Debug Mode
Enable debug logging to see all Slack events:
```env
NODE_ENV=development
```

## Advanced Configuration

### Custom Domain
Edit `cloudflare-tunnel/config.yml`:
```yaml
ingress:
  - hostname: your-custom-domain.com
    service: http://localhost:8765
```

### Multiple Workspaces
Create separate `.env` files for each workspace:
```bash
SLACK_WORKSPACE=workspace1 node src/proxy/cursor-web-proxy.js
```

### Production Deployment
1. Use process manager: `pm2 start src/proxy/cursor-web-proxy.js`
2. Enable HTTPS only in Cloudflare
3. Set `NODE_ENV=production` to disable debug logs
4. Implement rate limiting for public endpoints

## Next Steps

1. **Add MCP Tool Calls**: Implement actual integration with your MCP servers
2. **Build Modal Interfaces**: Create forms for user input
3. **Implement AI Responses**: Connect Claude for intelligent replies
4. **Add Database Storage**: Store conversation context and history
5. **Create Custom Workflows**: Build automation specific to your needs

## Related Documentation

- [MCP Servers Guide](./MCP-SERVERS.md)
- [Cloudflare Tunnel Setup](../cloudflare-tunnel/README.md)
- [Environment Configuration](./CONFIGURATION-GUIDE.md)
- [Testing Guide](./TESTING-GUIDE.md)