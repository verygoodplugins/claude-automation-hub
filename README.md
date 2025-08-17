# Claude Automation Hub 🤖

Your personal command center for Claude Desktop + MCP automations. Version-controlled, searchable, and constantly evolving with hot-reloadable tools.

## Quick Start

Copy any command from the `workflows/` directory and paste into Claude to run.

## Available MCP Integrations

### 🧠 AI & Reasoning
- ✅ **[Sequential Thinking](https://github.com/modelcontextprotocol/mcp-sequential-thinking)** - Advanced multi-step reasoning and problem-solving workflows
- ✅ **[OpenMemory](https://github.com/openmemory/mcp)** - Persistent AI memory and knowledge base with semantic search

### 🛠️ Development & Infrastructure  
- ✅ **[Context7](https://github.com/upstash/context7)** - Real-time library documentation and code examples lookup
- ✅ **[Playwright](https://github.com/microsoft/playwright-mcp)** - Web automation, testing, and browser interaction
- ✅ **[Browser Tools](https://github.com/agentdeskai/browser-tools-mcp)** - Advanced web debugging, performance audits, and SEO analysis
- ✅ **[PostgreSQL](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)** - Database queries, schema analysis, and data management
- ✅ **[Fly.io](https://fly.io/docs/mcp/)** - Application deployment and infrastructure management
- ✅ **[Sentry](https://mcp.sentry.dev/)** - Error tracking, performance monitoring, and debugging

### 💬 Communication & Support
- ✅ **[FreeScout](https://github.com/verygoodplugins/mcp-freescout)** - Complete support ticket lifecycle management and customer analytics
- ✅ **[Slack](https://github.com/slack-mcp/slack-mcp-server)** - Team communication, channel management, and workflow automation
- ✅ **[WhatsApp](https://github.com/modelcontextprotocol/whatsapp-mcp)** - Messaging automation and customer communication

### 🌐 Content & Publishing
- ✅ **[WordPress](https://github.com/modelcontextprotocol/mcp-wp)** - Content management, publishing workflows, and site automation

### 🍎 macOS Integration
- ✅ **[Apple Reminders](https://github.com/modelcontextprotocol/mcp-apple-reminders)** - Task and reminder management with Siri integration

### 📱 Mobile Notifications
- ✅ **[ntfy.sh Integration](tools/ntfy-notifications.js)** - Push notifications to mobile when workflows complete
- ✅ **[Workflow Notifications](tools/workflow-notifications.js)** - Quick notification helpers for any automation

### Configuration Examples
📁 **[MCP Config Examples](config/)** - Ready-to-use configurations for Cursor IDE and Claude Desktop with setup instructions

## Workflow Library

### 🌅 Daily Workflows
- [Morning Routine](workflows/daily/morning-routine.md) - Complete morning setup with calendar, email, tasks
- [Morning Support Triage](workflows/daily/morning-triage.md) - FreeScout ticket prioritization
- [End of Day Shutdown](workflows/daily/end-of-day-shutdown.md) - Complete workday closure and tomorrow prep

### 📅 Weekly Workflows
- [Review & Planning Session](workflows/weekly/review-planning.md) - Comprehensive weekly analysis and planning

### 🎯 On-Demand Workflows
- [Focus Mode Activation](workflows/on-demand/focus-mode.md) - Deep work environment setup
- [Customer Communication Hub](workflows/on-demand/customer-communication-hub.md) - Multi-channel customer analysis
- [Code Documentation Assistant](workflows/on-demand/code-documentation.md) - Automated project documentation
- [FreeScout Implementation](workflows/on-demand/freescout-implementation.md) - Ticket to PR workflow
- [Meeting Preparation](workflows/on-demand/meeting-preparation.md) - Comprehensive meeting prep with context
- [Project Initialization](workflows/on-demand/project-initialization.md) - Complete project setup automation
- [Learning Session Setup](workflows/on-demand/learning-session.md) - Optimized learning environment

## Top Automation Wins 🏆

| Workflow | Time Saved | Frequency | Monthly Impact |
|----------|------------|-----------|----------------|
| Morning Routine | 27 min | Daily | ~10 hours |
| End of Day Shutdown | 22 min | Daily | ~7 hours |
| Weekly Review | 75 min | Weekly | ~5 hours |
| Focus Mode | 10 min | 3x daily | ~10 hours |
| Support Triage | 40 min | Daily | ~13 hours |
| Meeting Prep | 30 min | 10x month | ~5 hours |
| Code Documentation | 3 hours | 2x month | ~6 hours |
| Project Init | 70 min | 2x month | ~2 hours |
| Learning Sessions | 40 min | 8x month | ~5 hours |

**Total Monthly Time Saved: 63+ hours** 🚀

## Dynamic MCP Tool Development 🔧

This hub supports **hot-reloadable MCP tools**! Create custom tools in the `./tools/` directory and they'll be instantly available to Claude without restarts.

### Quick Tool Creation

```javascript
// Save as ./tools/my_tool.js
export default {
  name: "my_custom_tool",
  description: "What this tool does",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Input parameter" }
    },
    required: ["input"]
  },
  handler: async ({ input }) => {
    // Your logic here
    return `Processed: ${input}`;
  }
};
```

Tool is immediately available - no restart needed!

## Workflow Patterns & Best Practices

### Morning Workflows
- Start with calendar review for context
- Triage communications by priority
- Set up environment for deep work
- Create time blocks for focused tasks

### Analysis Workflows
- Aggregate data from multiple sources
- Identify patterns and trends
- Generate actionable insights
- Store learnings for future reference

### Implementation Workflows
- Analyze issue thoroughly first
- Check documentation and past solutions
- Create isolated development environment
- Document solution for knowledge base

## Advanced Workflow Combinations

### The "Complete Context" Pattern
```
Gmail → FreeScout → WhatsApp → OpenMemory
```
Gather full customer context across all channels before responding.

### The "Productivity Stack" Pattern
```
Calendar → Reminders → Spotify → Browser → Focus Mode
```
Orchestrate multiple tools for optimal work environment.

### The "Knowledge Loop" Pattern
```
Issue → Context7 → Implementation → OpenMemory → Future Issues
```
Build institutional knowledge that improves over time.

## Creating New Workflows

1. **Identify repetitive tasks** you do daily/weekly
2. **List the MCP tools** that could help
3. **Test the workflow** in Claude
4. **Document with template**:
   - Command (what to tell Claude)
   - Prerequisites (required MCPs)
   - Time saved estimate
   - Success metrics
   - Sample output
5. **Save to appropriate folder** (daily/weekly/monthly/on-demand)
6. **Commit with clear message**

## Suggested New Workflows Based on Available Tools

### 1. "End of Day Shutdown"
- Save work in progress to OpenMemory
- Create tomorrow's task list in Reminders
- Send EOD status via WhatsApp
- Close browser tabs and clean Downloads
- Set up calendar blocks for tomorrow

### 2. "Meeting Preparation Assistant"
- Get meeting details from Calendar
- Search Gmail for related discussions
- Check FreeScout for customer issues if applicable
- Compile talking points in OpenMemory
- Set reminder 10 minutes before

### 3. "Learning Session Setup"
- Find documentation via Context7
- Create learning notes structure in Filesystem
- Block calendar for focused learning
- Set up Spotify study playlist
- Create practice exercises in Reminders

### 4. "Customer Success Check-in"
- Analyze customer's support history in FreeScout
- Check recent WhatsApp conversations
- Review Gmail threads
- Generate personalized check-in message
- Schedule follow-up reminder

### 5. "Project Initialization"
- Create project structure with Filesystem
- Set up Git worktree
- Get relevant documentation from Context7
- Create project tasks in Reminders
- Initialize README and documentation

## Configuration Management

### MCP Setup
1. **Choose your configuration**: Use examples from `config/` directory
   - `mcp-cursor.json` - For Cursor IDE integration
   - `mcp-claude-desktop.json` - For Claude Desktop application

2. **Customize for your environment**:
   - Replace placeholder API keys and URLs
   - Update file paths to match your system
   - Enable/disable tools based on your needs

3. **Security best practices**:
   - Never commit real API keys to version control
   - Use environment variables when possible
   - Regularly rotate tokens and credentials

### Workflow Evolution Tracking

This project uses `CHANGELOG.md` to track the evolution of workflows and integrations:

- **Version history** of workflow improvements
- **Time savings metrics** for each automation  
- **MCP integration updates** and new tools
- **Performance optimizations** and bug fixes

**Update the changelog** when you:
- Create new workflows or modify existing ones
- Add or update MCP integrations
- Discover significant time savings or optimizations
- Fix bugs or improve workflow reliability

Ask Claude: *"Update the changelog with my recent workflow changes and time savings improvements"*

## Security & Best Practices

- Never commit API keys or credentials
- Sanitize customer data in examples
- Use OpenMemory for sensitive patterns (not Git)
- Test workflows in safe environment first
- Keep customer-specific workflows private

## Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| MCP not responding | Check if service is running, restart Claude |
| Workflow timeout | Break into smaller chunks, add pagination |
| Authentication errors | Refresh tokens, check permissions |
| Rate limiting | Add delays, batch operations |
| Memory not persisting | Ensure OpenMemory MCP is configured |

## Contributing

1. Test thoroughly before committing
2. Include time saved estimates
3. Add clear documentation
4. Share successful automations with team
5. Update this README with new patterns

## Workflow Metrics Dashboard

Ask Claude: "Analyze my automation hub usage and show me:
- Most used workflows this week
- Total time saved
- Optimization opportunities
- Unused MCP tools that could help"

## Future Roadmap

- [ ] Add workflow scheduling (cron-like automation)
- [ ] Create workflow templates generator
- [ ] Build workflow sharing marketplace
- [ ] Add performance analytics
- [ ] Integrate more MCP tools as they become available

---

**Remember**: The best automation is the one you actually use. Start small, iterate often, and compound your time savings! 🚀
