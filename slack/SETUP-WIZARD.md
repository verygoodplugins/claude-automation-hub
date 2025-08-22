# Slack Integration Setup Wizard Guide

## Overview

The Slack Integration Setup Wizard is an interactive tool that ensures your Slack integration is properly configured before use. It automatically detects and helps fix common configuration issues, making the setup process foolproof.

## Quick Start

```bash
# Run the interactive setup wizard
node slack/setup-wizard.js

# Start with validation (recommended)
bash slack/start-slack-validated.sh --with-tunnel

# Start with monitoring enabled
bash slack/start-slack-validated.sh --monitor --with-tunnel
```

## Features

### 🔍 Comprehensive Validation
- **Environment Check**: Validates all required tokens and configuration
- **Token Testing**: Verifies tokens with Slack API
- **Server Health**: Ensures local server is running properly
- **Tunnel Status**: Checks Cloudflare tunnel connectivity
- **App Configuration**: Validates Slack app installation and permissions

### 🛠️ Auto-Fix Capabilities
- **Missing Variables**: Prompts for required environment variables
- **Server Issues**: Offers to start server automatically
- **Tunnel Problems**: Can start tunnel if not running
- **Configuration Help**: Provides exact URLs and settings needed

### 📊 Health Monitoring
- **Continuous Monitoring**: Checks health every minute
- **Auto-Restart**: Automatically restarts failed services
- **Token Validation**: Hourly token validity checks
- **Mobile Alerts**: NTFY notifications for critical issues
- **Status API**: HTTP endpoint for external monitoring

## Setup Process

### Step 1: Initial Setup

Run the setup wizard for first-time configuration:

```bash
node slack/setup-wizard.js
```

The wizard will:
1. Check Node.js version (≥16 required)
2. Validate environment variables
3. Test Slack tokens with API
4. Verify local server status
5. Check Cloudflare tunnel
6. Validate Slack app configuration

### Step 2: Environment Configuration

Required environment variables:

```bash
# Required
SLACK_BOT_TOKEN=xoxb-...      # Bot User OAuth Token
SLACK_SIGNING_SECRET=...       # 32-character signing secret

# Optional but recommended
SLACK_USER_TOKEN=xoxp-...     # User OAuth Token
SLACK_APP_ID=A...              # Slack App ID
SLACK_CLIENT_ID=...            # OAuth Client ID
SLACK_CLIENT_SECRET=...        # OAuth Client Secret

# For health monitoring
NTFY_TOPIC=slack-monitor      # NTFY topic for alerts
AUTO_RESTART=true              # Enable auto-restart
```

### Step 3: Slack App Configuration

Configure these URLs in your Slack app at [api.slack.com/apps](https://api.slack.com/apps):

#### Event Subscriptions
- Request URL: `https://automation.verygoodplugins.com/slack/events`
- Subscribe to bot events:
  - `app_mention`
  - `message.channels`
  - `message.im`

#### Interactivity & Shortcuts
- Request URL: `https://automation.verygoodplugins.com/slack/interactive`
- Enable shortcuts and interactive components

#### Slash Commands
Create commands with Request URL: `https://automation.verygoodplugins.com/slack/commands`
- `/claude` - Interact with Claude AI
- `/auto-jack` - Automation commands

#### OAuth & Permissions
Required bot token scopes:
- `app_mentions:read`
- `channels:history`
- `chat:write`
- `commands`
- `im:history`
- `reactions:write`
- `users:read`

### Step 4: Start Services

#### Basic Start
```bash
bash slack/start-slack.sh
```

#### Validated Start (Recommended)
```bash
bash slack/start-slack-validated.sh --with-tunnel
```

#### Debug Mode
```bash
bash slack/start-slack-validated.sh --debug --with-tunnel
```

#### With Monitoring
```bash
bash slack/start-slack-validated.sh --monitor --with-tunnel
```

## Startup Options

### `start-slack-validated.sh` Options

| Option | Description |
|--------|-------------|
| `--force` | Skip validation checks (not recommended) |
| `--monitor` | Enable health monitoring |
| `--debug` | Enable debug mode with verbose logging |
| `--with-tunnel` | Start Cloudflare tunnel |
| `--help` | Show help message |

## Health Monitoring

### Automatic Monitoring

When started with `--monitor`, the system will:
- Check server health every minute
- Validate tokens every hour
- Auto-restart failed services
- Send mobile notifications for issues
- Log all events to `slack/health-monitor.log`

### Manual Health Checks

```bash
# Check server health
curl http://localhost:8765/health

# Check monitor status
curl http://localhost:8767/status

# View debug monitor
curl http://localhost:8766/status
```

### NTFY Notifications

Configure mobile alerts:

1. Install NTFY app on your phone
2. Subscribe to your topic
3. Set `NTFY_TOPIC` in `.env`
4. Receive alerts for:
   - Service failures
   - Auto-restarts
   - Token invalidation
   - Connection issues

## Troubleshooting

### Common Issues and Solutions

#### "dispatch_failed" Error
**Cause**: Slack can't reach your server
**Solution**: 
```bash
# Ensure all services are running
bash slack/start-slack-validated.sh --with-tunnel
```

#### Invalid Token Errors
**Cause**: Token expired or incorrect
**Solution**:
1. Regenerate token in Slack app settings
2. Update `.env` file
3. Restart services

#### Signature Verification Failed
**Cause**: Wrong signing secret or body parsing issue
**Solution**:
1. Copy signing secret from Slack app
2. Update `SLACK_SIGNING_SECRET` in `.env`
3. Ensure latest server code is running

#### Tunnel Not Accessible
**Cause**: Cloudflare tunnel not running
**Solution**:
```bash
# Install cloudflared if needed
brew install cloudflared

# Login to Cloudflare
cloudflared tunnel login

# Start tunnel
./cloudflare-tunnel/start-tunnel.sh
```

### Debug Tools

#### Event Monitor
Captures all incoming Slack events:
```bash
node slack/debug/slack-event-monitor.js
```

#### Connection Tester
Tests all aspects of integration:
```bash
node slack/debug/test-slack-connection.js
```

#### Debug Logs
View detailed logs:
```bash
# Real-time event log
tail -f slack/debug/slack-events.log

# Detailed JSON events
jq . slack/debug/slack-events-detailed.json

# Server logs (debug mode)
tail -f slack/debug/server.log
```

## File Structure

```
slack/
├── setup-wizard.js           # Interactive setup tool
├── health-monitor.js         # Health monitoring system
├── start-slack.sh           # Basic startup script
├── start-slack-validated.sh # Validated startup with options
├── debug/
│   ├── slack-event-monitor.js    # Event monitoring tool
│   ├── test-slack-connection.js  # Connection tester
│   ├── start-debug.sh           # Debug mode starter
│   └── DEBUGGING-GUIDE.md       # Troubleshooting guide
├── docs/
│   ├── SLACK-INTEGRATION.md     # Integration guide
│   └── SLACK-TOKEN-GUIDE.md     # Token configuration
└── SETUP-WIZARD.md          # This file
```

## Best Practices

### Security
- Never commit tokens to git
- Use `.env` file for secrets
- Enable signature verification
- Restrict OAuth scopes to minimum needed

### Reliability
- Always use validated startup
- Enable health monitoring in production
- Configure NTFY for mobile alerts
- Keep logs for debugging

### Development
- Use debug mode during development
- Test with event monitor running
- Validate changes with connection tester
- Document any new configuration

## Quick Commands Reference

```bash
# First-time setup
node slack/setup-wizard.js

# Normal operation
bash slack/start-slack-validated.sh --with-tunnel --monitor

# Development
bash slack/start-slack-validated.sh --debug --with-tunnel

# Testing
node slack/debug/test-slack-connection.js

# Monitoring
curl http://localhost:8767/status | jq

# Debug events
tail -f slack/debug/slack-events.log
```

## Getting Help

1. Run setup wizard for interactive help
2. Check `slack/debug/DEBUGGING-GUIDE.md`
3. Review logs in `slack/debug/`
4. Test with `slack/debug/test-slack-connection.js`
5. Check Slack API audit logs

## Next Steps

After successful setup:
1. Test slash commands in Slack
2. Configure workflow automations
3. Set up scheduled tasks
4. Integrate with MCP tools
5. Enable production monitoring