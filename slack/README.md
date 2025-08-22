# Slack Integration

This directory contains all Slack-related functionality for the Claude Automation Hub.

## Directory Structure

```
slack/
├── start-slack.sh              # Main script to start Slack integration
├── slack-workflow-steps.js     # MCP tool for Slack workflow steps
├── scripts/                    # Slack utility scripts
│   ├── setup-slack-home.js     # Setup Slack app home tab
│   ├── slack-debug-tokens.js   # Debug Slack tokens
│   ├── slack-get-user-id.js    # Get Slack user ID
│   ├── slack-setup-automation.js # Automation setup
│   └── slack-verify-scopes.js  # Verify Slack OAuth scopes
├── docs/                       # Slack documentation
│   ├── SLACK-INTEGRATION.md   # Main integration guide
│   └── SLACK-TOKEN-GUIDE.md   # Token configuration guide
└── test/                       # Slack tests
    └── test-slack-integration.js # Integration tests
```

## Quick Start

1. Configure your Slack app tokens in `.env`:
   ```bash
   SLACK_BOT_TOKEN=xoxb-...
   SLACK_USER_TOKEN=xoxp-...
   ```

2. Start the Slack integration:
   ```bash
   ./slack/start-slack.sh
   ```

3. Optional: Start with Cloudflare tunnel:
   ```bash
   ./slack/start-slack.sh --with-tunnel
   ```

## Documentation

- [Main Integration Guide](docs/SLACK-INTEGRATION.md) - Complete setup and configuration
- [Token Guide](docs/SLACK-TOKEN-GUIDE.md) - How to obtain and configure tokens

## Scripts

All utility scripts are in the `scripts/` folder:
- `setup-slack-home.js` - Configure the Slack app home tab
- `slack-debug-tokens.js` - Debug and verify token configuration
- `slack-get-user-id.js` - Retrieve your Slack user ID
- `slack-verify-scopes.js` - Check OAuth scope permissions

## Testing

Run integration tests:
```bash
node slack/test/test-slack-integration.js
```