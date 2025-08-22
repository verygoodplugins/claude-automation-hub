# Slack Token Configuration Guide

## Quick Start

The Slack MCP server supports **User OAuth tokens (xoxp-)** directly! This is much simpler than browser tokens.

## Token Types and Their Uses

### 1. 🤖 Bot Token (`xoxb-`)
**Used for:** Home tab, bot operations
- ✅ `views.publish` - Publishing home tabs
- ✅ Bot-level operations
- ❌ `search` operations not supported
- **Where to get:** Slack App → OAuth & Permissions → Bot User OAuth Token

### 2. 👤 User Token (`xoxp-`) 
**Used for:** MCP operations, user-level actions
- ✅ Search messages (with `search:read` scope)
- ✅ Read channel history
- ✅ Send messages as user
- ✅ **Works with Slack MCP server!**
- **Where to get:** Slack App → OAuth & Permissions → User OAuth Token

## Complete Setup Guide

### Step 1: Configure Your Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Select your app (or create a new one)
3. Go to **OAuth & Permissions**
4. Add these **User Token Scopes**:
   - `channels:history` - View messages in public channels
   - `channels:read` - View basic channel information
   - `groups:history` - View messages in private channels
   - `groups:read` - View private channel information
   - `im:history` - View direct message history
   - `im:read` - View direct message information
   - `im:write` - Start direct messages
   - `mpim:history` - View group DM history
   - `mpim:read` - View group DM information
   - `mpim:write` - Start group DMs
   - `users:read` - View workspace users
   - `chat:write` - Send messages
   - `search:read` - **Critical for MCP search functionality**

5. **Reinstall the app** to your workspace
6. Copy the **User OAuth Token** (starts with `xoxp-`)

### Step 2: Configure Your Environment

Add both tokens to your `.env` file:

```env
# Bot token for home tab and bot operations
SLACK_BOT_TOKEN=xoxb-your-bot-token

# User token for MCP and user operations
SLACK_USER_TOKEN=xoxp-your-user-token
```

### Step 3: Configure MCP

Update your Cursor/Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "slack-mcp-server@latest",
        "--transport",
        "stdio"
      ],
      "env": {
        "SLACK_MCP_XOXP_TOKEN": "xoxp-your-user-token",
        "SLACK_MCP_ADD_MESSAGE_TOOL": "true"
      }
    }
  }
}
```

### Step 4: Verify Your Setup

Run the verification script:

```bash
node scripts/slack-verify-scopes.js
```

This will check if your user token has all required scopes.

## Token Usage Map

| Operation | Bot Token | User Token |
|-----------|-----------|------------|
| Publish Home Tab | ✅ | ❌ |
| Send Messages | ✅ | ✅ |
| Search Messages | ❌ | ✅ |
| MCP Operations | ❌ | ✅ |
| Channel History | ❌ | ✅ |

## Common Issues and Solutions

### Missing `search:read` Scope

**Symptom:** MCP returns `missing_scope` error when searching

**Solution:**
1. Add `search:read` to User Token Scopes in your Slack app
2. Reinstall the app to your workspace
3. Copy the new token to your configuration
4. Restart Cursor/Claude Desktop

### `not_allowed_token_type` Error

**Symptom:** Error when using wrong token type

**Solution:**
- Use **Bot token** for `views.publish` (home tab)
- Use **User token** for MCP operations

### Token Not Working

**Symptom:** Authentication failures

**Solution:**
1. Verify token format (xoxp- for user, xoxb- for bot)
2. Check token hasn't expired
3. Ensure app is installed to workspace
4. Verify all required scopes are added

## Testing Your Integration

### Test Home Tab (Bot Token)
```bash
node scripts/setup-slack-home.js YOUR_USER_ID
```

### Test MCP Search (User Token)
In Claude Desktop:
```
Search Slack for "your search term"
```

### Debug Token Capabilities
```bash
node scripts/slack-debug-tokens.js
```

## Best Practices

1. **Use User Token for MCP** - More secure than browser tokens
2. **Keep tokens in .env** - Never commit tokens to git
3. **Add all required scopes** - Especially `search:read`
4. **Test after changes** - Run verification scripts
5. **Restart after config changes** - Cursor/Claude Desktop needs restart

## Summary

- **Bot Token (xoxb-)** → Home tab, bot operations
- **User Token (xoxp-)** → MCP server, search, user operations
- **No browser tokens needed!** → User token works directly with MCP

The Slack MCP server documentation confirms: "XOXP user tokens are more secure and don't require browser session extraction."