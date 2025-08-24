# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Commands

### Development & Testing
```bash
# Run the MCP server with hot-reload capability
npm run dev
# or
npm run mcp-server

# Test various components
npm run test-tools      # Test custom MCP tools
npm run test-mobile     # Test mobile notification system  
npm run test-bundled    # Test bundled notifications
npm run test-scheduler  # Test workflow scheduler
npm run morning-now     # Trigger morning routine immediately
```

### Testing Individual Tools
Custom tools in `./tools/` are hot-reloadable. Test them without restart:
- Ask: "Use analyze_hub_stats to show automation metrics"
- Ask: "Use generate_workflow_template to create a new workflow"
- Ask: "Use suggest_workflows to recommend productivity workflows"
- Ask: "Use send_notification to test NTFY notifications"

## Architecture Overview

### Core System Design
This is a **Claude Desktop + MCP automation hub** that orchestrates workflows across multiple tools and services with mobile notification support. The architecture consists of:

1. **MCP Integration Layer** (`mcp-reloader`)
   - Hot-reloadable custom tools in `./tools/`
   - Connects to 15+ MCP servers (FreeScout, Playwright, WordPress, OpenMemory, etc.)
   - No restart needed when adding/modifying tools

2. **Workflow System** (`./workflows/`)
   - Markdown-based workflow definitions organized by frequency (daily/weekly/monthly/on-demand)
   - Copy-paste commands for Claude to execute
   - Time-saving metrics tracking (63+ hours/month documented)

3. **Mobile Notification System** (`src/notifications/`)
   - NTFY integration for push notifications to mobile devices
   - Smart bundling to prevent notification overload (max 4 per bundle, 30-min windows)
   - Context handoff for future mobile AI assistants
   - Priority-based delivery (min/low/default/high/max)

4. **Automated Scheduling** (`src/scheduler/workflow-scheduler.js`)
   - Morning routine auto-triggers at 7:00 AM Mon-Fri
   - End-of-day shutdown at 5:30 PM Mon-Fri
   - Weekly review Friday 4:00 PM
   - Urgent item monitoring every 15 minutes during work hours

5. **Automation Hub Core** (`src/automation-hub.js`)
   - Orchestrates notifications, context storage, and scheduling
   - Integrates with OpenMemory for persistent knowledge
   - Manages workflow execution and bundling
   - Provides context bridge for cross-device AI handoffs

## Key MCP Integrations

The hub connects to these MCP servers (configured in `.mcp.json`
- **FreeScout**: Support ticket management, customer analytics, ticket-to-PR workflow
- **Playwright**: Browser automation, testing, screenshots, web interactions
- **WordPress**: Content management, publishing workflows, plugin/theme management
- **OpenMemory**: Persistent AI memory and knowledge base with semantic search
- **Context7**: Real-time library documentation and code examples lookup
- **PostgreSQL**: Database queries, schema management, data analysis
- **Apple ecosystem**: Calendar, Reminders, Mail, Messages, Maps, Notes, Contacts
- **Communication**: Slack (team messaging), WhatsApp (customer comms), NTFY (mobile push)
- **Development**: Sentry (error tracking), Fly.io (deployment), Sequential Thinking (reasoning)
- **Browser Tools**: Advanced debugging, performance audits, SEO analysis

## Workflow Patterns

### Workflow Structure
All workflows follow this pattern in `./workflows/{frequency}/{name}.md`:
1. Command to paste into Claude
2. Prerequisites (required MCPs)
3. Expected outputs and success metrics
4. Time saved estimates (measured and documented)
5. Sample outputs for validation

### Creating New Workflows
1. Identify repetitive multi-step tasks
2. List required MCP tools
3. Test the workflow in Claude
4. Document in appropriate folder (daily/weekly/monthly/on-demand)
5. Update README with time savings
6. Add to CHANGELOG.md

### Mobile Notification Integration
Workflows can trigger mobile notifications via NTFY:
- **Bundled delivery**: Multiple updates combined into single notification
- **Smart actions**: Context-aware buttons like "Ask Claude", "Reschedule", "Next Task"
- **Priority routing**: Urgent items bypass bundling
- **Context storage**: Full details saved for mobile MCP retrieval

## Custom Tool Development

### Creating a New Tool
Save to `./tools/your_tool.js`:
```javascript
export default {
  name: "tool_name",
  description: "What this tool does",
  inputSchema: {
    type: "object",
    properties: {
      param: { type: "string", description: "Parameter" }
    },
    required: ["param"]
  },
  handler: async ({ param }) => {
    // Tool logic here
    return `Result: ${param}`;
  }
};
```
Tool is immediately available - no restart needed due to hot-reload.

### Existing Custom Tools
- `ntfy-notifications.js`: Send mobile push notifications
- `workflow-notifications.js`: Quick notification helpers
- `hub_stats.js` / `hub-stats.js`: Usage analytics and metrics
- `workflow_generator.js`: Dynamic workflow creation
- `workflow_suggester.js`: AI-powered workflow recommendations
- `example-workflow-generator.js`: Template generation
- `test-tool.js`: MCP integration testing

## Environment Setup

### Required Environment Variables
```bash
export NTFY_TOPIC="claude-automation-$(whoami)-$(openssl rand -hex 4)"
```

### MCP Configuration
Configuration examples in `./config/`:
- `mcp-cursor.json`: For Cursor IDE integration
- `claude-settings-example.json`: Claude Desktop settings
- `claude_desktop_config-example.json`: Full MCP server configs

## Testing Workflows

### Quick Validation (Dry Run)
Test workflows without full execution:
- "Run morning routine but only show what would happen"
- "Do a mini weekly review for the last 3 days"
- "Prepare focus mode but don't activate"

### Performance Testing
- "Time how long it takes to run morning routine"
- "Which workflows have the highest failure rate?"
- "Show average execution time for each workflow"

### Automated Scheduler Testing
```bash
npm run test-scheduler  # Test all scheduled workflows
npm run morning-now     # Force morning routine immediately
```

## Common Development Tasks

### Adding a New MCP Integration
1. Add server config to MCP configuration file
2. Create workflow examples in `./workflows/`
3. Test integration: "Test connection to [MCP name]"
4. Document in README and update CHANGELOG

### Debugging Workflows
- Add debug flag: "Run morning routine with debug output"
- Check MCP connectivity: "List all available MCP tools"
- Test individual steps: "Run first 3 steps of morning routine"
- Check scheduler status: `hub.getSchedulerStatus()`

### Mobile Notification Debugging
```bash
npm run test-mobile      # Test NTFY connection
npm run test-bundled     # Test notification bundling
node debug-notifications.js  # Debug notification flow
```

## Project Structure

```
├── tools/              # Hot-reloadable custom MCP tools
├── workflows/          # Markdown workflow definitions
│   ├── daily/         # Morning routine, EOD, triage (auto-scheduled)
│   ├── weekly/        # Review, planning, mastermind prep
│   ├── monthly/       # Business review, tax compliance
│   └── on-demand/     # Focus mode, documentation, learning, etc.
├── src/               # Core automation hub implementation
│   ├── automation-hub.js         # Main orchestrator
│   ├── notifications/            # Mobile notification system
│   │   ├── notification-manager.js   # NTFY integration
│   │   └── notification-bundler.js   # Smart bundling logic
│   ├── context/                  # Context bridge for handoffs
│   │   └── context-bridge.js         # Mobile MCP preparation
│   ├── scheduler/                # Automated scheduling
│   │   └── workflow-scheduler.js     # Time-based triggers
│   └── config/                   # Schema definitions
│       └── context-schemas.js        # Context structure specs
├── config/            # MCP configuration examples
├── docs/              # Additional documentation
└── test-*.js         # Various test scripts
```

## Key Implementation Details

### Notification Bundling Logic
- **Bundle Window**: 30 minutes max
- **Bundle Size**: 4 notifications max
- **Priority Handling**: 'max' priority triggers immediate send
- **Smart Actions**: Generated based on bundle content (reschedule, next task, handle urgent)

### Scheduler Implementation
- Uses `setInterval` for minute-precision checking
- Prevents duplicate runs with 50-minute cooldown
- Supports daily, weekly, and interval-based schedules
- Timezone-aware (default: Europe/Berlin)

### Context Storage Pattern
Each workflow stores context in OpenMemory with:
- Unique handoff ID for retrieval
- Structured data following schemas in `context-schemas.js`
- Tags for semantic search
- Mobile-optimized action suggestions

## Workflow Time Savings (Measured)

Current documented impact:
- **Morning Routine**: 27 min/day → ~10 hours/month
- **End of Day**: 22 min/day → ~7 hours/month  
- **Support Triage**: 40 min/day → ~13 hours/month
- **Weekly Review**: 75 min/week → ~5 hours/month
- **Focus Mode**: 10 min × 3/day → ~10 hours/month
- **Meeting Prep**: 30 min × 10/month → ~5 hours/month
- **Total**: 63+ hours saved monthly

## MCP Server Implementation

This project includes its own MCP server (`server.js`) that provides hot-reloadable tools:

```bash
# Start the MCP server directly
node server.js

# Or use the reloader for development
npm run dev
```

The server automatically loads all tools from `./tools/` directory and makes them available to any MCP client.

### Additional Commands

```bash
# Web proxy for clickable links (bypasses Claude Desktop sandboxing)
npm run proxy
npm run proxy:dev     # With file watching

# Setup clickable links with interactive guide
npm run setup:links

# Testing commands
npm run test-cursor   # Test Cursor CLI integration
```

## Recent Updates

### Mobile MCP Foundations (Merged to Main)
- ✅ NTFY mobile notification support
- ✅ Smart notification bundling system
- ✅ Context bridge for mobile AI handoffs
- ✅ Automated workflow scheduling
- ✅ Clickable links feature with web proxy

### Documentation Complete
- `AUTOMATED-SCHEDULING.md`: Scheduler setup and usage
- `MOBILE-SETUP.md`: Mobile notification configuration  
- `DASHBOARD.md`: Hub metrics and analytics
- `TESTING-GUIDE.md`: Comprehensive testing documentation
- `TOOLS-GUIDE.md`: Tool development guide

### Testing Infrastructure
- `test-mobile.js`: Mobile notification testing
- `test-bundled.js`: Bundle system validation
- `test-scheduler.js`: Automated scheduling tests
- `test-cursor-integration.js`: Cursor CLI testing

## Version Control Notes

- Current branch: `main` 
- Use `CHANGELOG.md` to track workflow evolution
- Never commit API keys or sensitive data
- Customer-specific workflows stay private