# Claude Automation Hub

A comprehensive automation system for Claude Desktop with intelligent agents, memory integration, and 60+ hours of monthly time savings.

## 🚀 Features

### Core Capabilities
- **🤖 Intelligent Agent System** - 5 specialized agents for automated maintenance and optimization
- **🧠 Memory Integration** - Persistent knowledge base with OpenMemory MCP
- **⚡ Parallel Execution** - Agents run concurrently with shared context for 50% performance boost
- **🔄 Hot-Reloadable Tools** - Add/modify tools without restarting
- **📊 15+ MCP Integrations** - WordPress, FreeScout, Slack, GitHub, and more
- **⏰ Automated Scheduling** - Time-based workflow triggers
- **📱 Mobile Notifications** - NTFY push notification support

### Slack Integration
- 🤖 Full Slack AI bot capabilities with [complete integration guide](docs/SLACK-INTEGRATION.md)
- 🔧 6 pre-built workflow steps for automation
- 🌐 Secure tunnel using Cloudflare (FREE)
- 🚀 Works from your local machine

### Advanced Features
- 🔧 **Node.js Version Management** - Automatic Node version detection for MCP servers
- 🌐 **Browser Profile Management** - Persistent login sessions for web automation
- 🔒 **Security** - Request signature verification and environment-based configuration
- 🎯 **Smart Agent Coordination** - Agents share resources and avoid conflicts

## Quick Start (2 minutes)

### For existing tunnel (if you followed setup before):

```bash
# This fixes the credential issue and starts everything
./quick-fix.sh
```

### For new setup:

1. **Install dependencies:**
```bash
npm install express
```

2. **Copy environment template:**
```bash
cp .env.example .env
```

3. **Edit `.env`** with your settings

4. **Run setup:**
```bash
./setup-tunnel-opensource.sh
```

5. **Add DNS record** in Cloudflare (shown in output)

6. **Start everything:**
```bash
./quick-fix.sh
```

## Slack App Configuration

### Event Subscriptions
- Request URL: `https://automation.yourdomain.com/slack/events`
- Subscribe to: `app_mention`, `message.im`, `message.channels`

### Interactivity & Shortcuts
- Request URL: `https://automation.yourdomain.com/slack/interactive`

### Workflow Steps
- Request URL: `https://automation.yourdomain.com/slack/workflow`

## Available Workflow Steps

1. **Create WP Fusion Post** - Publish to WordPress
2. **Create VGP Documentation** - Create documentation
3. **Create Support Ticket** - FreeScout integration
4. **AI Channel Summary** - Claude-powered summaries
5. **Save to OpenMemory** - Store important info
6. **Send Automation Alert** - Push notifications

## 🤖 Intelligent Agents

The hub includes 5 specialized agents that work together to maintain and optimize your automation system:

### Active Agents

1. **📚 doc-conflict-resolver**
   - Identifies and resolves documentation conflicts
   - Ensures single source of truth for configurations
   - Fixes broken cross-references automatically

2. **🧹 session-cleanup**
   - Cleans up abandoned test files and temporary markdown
   - Archives important documents with timestamps
   - Updates .gitignore automatically
   - Recovers disk space (avg 12MB per session)

3. **🧠 project-memory-keeper**
   - Captures project decisions and patterns
   - Tracks evolution of the codebase
   - Stores integration patterns for future reference
   - Creates weekly synthesis of learnings

4. **💾 session-memory-capturer**
   - Automatically captures important decisions from each session
   - Documents problem solutions and failed attempts
   - Creates session summaries with metrics
   - Integrates with git history

5. **🔄 config-synchronizer**
   - Keeps example configs in sync with actual implementation
   - Updates documentation when configs change
   - Validates JSON syntax
   - Tracks configuration drift patterns

### Agent Coordination

Agents use shared memory and context to:
- **Avoid conflicts** - File operations run sequentially
- **Share resources** - Git status checked once, shared with all
- **Learn patterns** - Store discoveries for future sessions
- **Run in parallel** - Memory agents execute concurrently for 50% speed boost

## Project Structure

```
claude-automation-hub/
├── .claude/               # Claude Code configuration
│   ├── agents/           # Intelligent agent definitions
│   ├── commands/         # Custom Claude commands
│   ├── reports/         # Agent-generated reports
│   └── settings.json    # Claude settings
├── .env                  # Your configuration (git ignored)
├── .env.example         # Template for others
├── tools/               # Hot-reloadable MCP tools
├── workflows/           # Automation workflows
│   ├── daily/          # Morning routine, EOD, triage
│   ├── weekly/         # Reviews and planning
│   ├── monthly/        # Business reviews
│   └── on-demand/      # Focus mode, deep work
├── src/                 # Core implementation
│   ├── automation-hub.js    # Main orchestrator
│   ├── notifications/      # Mobile push notifications
│   └── scheduler/          # Workflow scheduling
├── simple-webhook-server.js # Basic Slack webhook handler
├── workflow-steps-server.js # Full workflow implementation
├── quick-fix.sh           # Quick start script
├── setup-tunnel-opensource.sh # Open source setup
└── cloudflare-tunnel/     # Tunnel configuration
    └── config.yml         # Auto-generated config
```

## Troubleshooting

### Error 1033
- Check DNS record is added
- Verify tunnel is running: `ps aux | grep cloudflared`
- Test locally: `curl http://localhost:8765/health`

### Slack Challenge Failed
- Ensure webhook server is running
- Check tunnel status
- Verify URL in Slack matches your domain

### Credentials Issue
The tunnel creates a UUID-based credential file. Our scripts handle this automatically, but if you have issues:
```bash
# Find your credential file
ls ~/.cloudflared/*.json

# Update .env with the correct path
# TUNNEL_CREDENTIALS_FILE=/path/to/your/file.json
```

## Node.js Version Management for MCP Servers

If you use NVM or other Node version managers, Claude Desktop might use the wrong Node.js version for MCP servers. This project includes an automatic fix:

### Setup (One-time)

```bash
# Run the setup script
./scripts/setup-npx-wrapper.sh
```

This creates `/usr/local/bin/npx-for-claude` that automatically loads your correct Node.js version.

### Benefits

- ✅ **Automatic NVM detection** - Uses your default Node version
- ✅ **No manual path configuration** - Works with any NVM setup
- ✅ **Improved MCP reliability** - Eliminates Node version conflicts
- ✅ **Easy to maintain** - Single script handles all MCP servers

### Usage in Claude Desktop Config

```json
{
  "mcpServers": {
    "openmemory": {
      "command": "npx-for-claude",
      "args": ["-y", "openmemory"]
    },
    "context7": {
      "command": "npx-for-claude", 
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

## Browser Profile Management

Maintain persistent login sessions across browser automation tasks:

### Create Browser Profiles

```bash
# Create profiles for different sites/purposes
node tools/browser-profile-manager.js create gmail-work
node tools/browser-profile-manager.js create social-media
node tools/browser-profile-manager.js create admin-panel
```

### List and Manage Profiles

```bash
# List all profiles
node tools/browser-profile-manager.js list

# Get profile info
node tools/browser-profile-manager.js info gmail-work

# Interactive management
node tools/browser-profile-manager.js interactive
```

### Use in Automation Code

```javascript
import { BrowserProfileManager } from './src/browser/profile-manager.js';

const profileManager = new BrowserProfileManager();

// For Playwright
const options = profileManager.getPlaywrightOptions('gmail-work');
const browser = await playwright.chromium.launch(options);

// For Puppeteer  
const options = profileManager.getPuppeteerOptions('gmail-work');
const browser = await puppeteer.launch(options);
```

### Benefits

- 🔐 **Persistent logins** - Stay logged in between sessions
- 📁 **Organized profiles** - Separate contexts for different sites
- 🔒 **Secure storage** - Profiles stored in `~/.claude-automation-hub/`
- 🚀 **Easy integration** - Works with Playwright, Puppeteer, and BrowserMCP

## For Open Source Contributors

This project is designed to be easily forked and customized:

1. **Use `.env`** for all configuration
2. **Credentials stay local** (never commit `.env`)
3. **Cloudflare FREE plan** works perfectly
4. **No cloud servers needed** - runs locally
5. **Node version management** - Automatic NVM compatibility
6. **Browser profiles** - Persistent web automation sessions

## Environment Variables

See `.env.example` for all available options:
- `TUNNEL_DOMAIN` - Your domain (e.g., automation.yourdomain.com)
- `SERVER_PORT` - Local server port (default: 8765)
- `SLACK_*` - Slack app credentials
- `NTFY_TOPIC` - For push notifications

## License

MIT - Feel free to use this in your own projects!

## Support

- Check the [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Open an issue for bugs or questions
- PRs welcome!
