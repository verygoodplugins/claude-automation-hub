# Claude Automation Hub 🤖

Your personal command center for Claude Desktop + MCP automations. Version-controlled, searchable, and constantly evolving with hot-reloadable tools.

## Quick Start

1. **Security Setup** (Required for production use):
   ```bash
   cp .env.example .env
   # Edit .env with your settings - see SECURITY.md for details
   ```

2. **Run workflows**: Copy any command from the `workflows/` directory and paste into Claude to run.

## 🔥 Hot-Reload Development

This hub uses `mcp-reloader` for **instant tool development** - create and modify MCP tools in `tools/` without restarting Claude Desktop.

**Setup**: Configure Claude Desktop with:
```json
"automation-hub": {
  "command": "node",
  "args": ["/path/to/claude-automation-hub/node_modules/mcp-reloader/dist/server.js"],
  "cwd": "/path/to/claude-automation-hub"
}
```
Replace `/path/to/claude-automation-hub` with your actual project path. See [SECURITY.md](SECURITY.md) for secure setup.

**Example**: Create `tools/my-tool.js` → instantly available in Claude → modify and test in real-time.

## 🎯 Power User Example

**Daily AI Dashboard**: "Generate my daily summary with Cursor deeplinks for all code tasks"

Combines multiple MCP tools:
- **Apple Reminders MCP** → Pull tasks from iOS Reminders
- **Cursor CLI Integration** → Generate **clickable HTTP links** that open files in Cursor IDE
- **Web Proxy Server** → Bypass Claude Desktop sandboxing for truly clickable links
- **AI Analysis** → Prioritize by impact, categorize by type, estimate time

Result: Interactive dashboard with **real clickable links** - perfect for emails, team sharing, and automation!

## 🔗 Clickable Links Feature

**Problem**: Claude Desktop's sandboxing prevents direct file links in artifacts.  
**Solution**: Local web proxy that creates real HTTP links to open files in Cursor IDE.

### Quick Setup
```bash
# Interactive setup with colors and emojis!
npm run setup:links

# Start the web proxy
npm run proxy
```

### Usage
```javascript
// Generate clickable link
await cursor_cli_deeplink({
  action: "generate_link",
  filePath: "src/bug.js",
  lineNumber: 42,
  prompt: "Fix the memory leak in this function",
  title: "🐛 Fix Memory Leak"
});
// → Returns: http://localhost:8765/cursor/abc123
```

**Perfect for**: Daily dashboards, email automation, team collaboration, any workflow needing **real clickable links** that bypass sandboxing.

### Advanced: Network Access

For advanced users who want to trigger links from other devices on the local network:

```bash
# WARNING: Exposes proxy to local network
CURSOR_PROXY_BIND=0.0.0.0 npm run proxy

# More secure: Bind to specific network interface  
CURSOR_PROXY_BIND=192.168.1.100 npm run proxy
```

**Use Cases:**
- Trigger from phone apps on same WiFi network
- Access from another computer on local network  
- Integration with home automation systems
- Remote development workflows

**Security Notice:** ⚠️ Only use network access on trusted networks. See [SECURITY.md](SECURITY.md) for detailed security considerations and mitigation strategies.

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
- ✅ **[Cursor CLI Integration](tools/)** - Open files at specific lines, **generate clickable links**, run headless cursor-agent commands

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

## How NTFY Mobile Notifications Work 📱

NTFY is a simple, open-source push notification service that lets your automation hub send real-time alerts to your mobile device. Here's exactly how it works:

### The Technical Flow
1. **Your workflow runs** → Claude executes automation steps
2. **Notification triggered** → Workflow calls `send_notification()` MCP tool
3. **HTTP request sent** → Tool posts to `https://ntfy.sh/your-topic`
4. **ntfy.sh relays** → Service pushes to all subscribed devices
5. **Mobile receives** → Your phone gets instant notification

### What Triggers Notifications
Notifications are **explicitly triggered** by your workflows when they call the `send_notification` tool:

```javascript
// In any workflow - this sends notification
await send_notification({
  message: "Morning routine complete! 8 tasks done, calendar updated.",
  title: "Claude Automation Hub",
  priority: "default",
  tags: ["morning", "complete"]
});
```

**Key Point**: Notifications only happen when workflows explicitly request them - they're not automatic.

### Current Triggers in Your Workflows
- **End-of-Day Shutdown**: Start + completion notifications with summary
- **Morning Routine**: Completion notification with daily overview
- **Long-running workflows**: Progress updates and final results
- **Error conditions**: Immediate alerts when automations fail

### Setup Requirements
1. **Install ntfy app**: [iOS](https://apps.apple.com/app/ntfy/id1625396347) | [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy)
2. **Subscribe to your topic**: Open app → Subscribe → Enter your topic name
3. **Set environment variable**: `export NTFY_TOPIC="your-unique-topic-name"`
4. **Test it works**: Run any workflow with notifications enabled

### Topic Security
- Your topic name acts as your "channel" - keep it unique and private
- Anyone who knows your topic can send you notifications
- Use format like: `claude-hub-yourname-randomstring`
- Example: `claude-automation-alerts-x7y9z`

### Notification Features
- **Rich formatting**: Title, message, priority levels, tags
- **Action buttons**: Tap to open URLs or trigger responses  
- **Priority levels**: `min`, `low`, `default`, `high`, `urgent`
- **Emoji support**: Full Unicode including 🤖 ✅ 🚨 emojis
- **Offline queuing**: Notifications delivered when device comes online

### Cost & Reliability
- **Free**: ntfy.sh public service is completely free
- **No registration**: Just pick a topic name and start using
- **High uptime**: Simple, reliable service with good track record
- **Self-hostable**: Can run your own ntfy server if needed

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

## Incorporating NTFY into Your Workflows 🔧

### Quick Integration Patterns

**1. Start + Completion Pattern** (Recommended for long workflows)
```
At workflow start:
→ "🔄 Starting [Workflow Name]... estimated 5 minutes"

At workflow end:  
→ "✅ [Workflow Name] Complete! [Summary of results]"
```

**2. Progress Updates Pattern** (For complex multi-step workflows)
```
Step milestones:
→ "📊 Step 3/8: Calendar updated, 12 meetings processed"
→ "📧 Step 6/8: Email triage complete, 3 urgent flagged"
```

**3. Error Handling Pattern** (Critical for reliability)
```
On failure:
→ "⚠️ [Workflow] failed at step X: [error]. Manual intervention needed."
```

### Adding Notifications to Existing Workflows

**For Morning Routine:**
```markdown
Add these steps to your morning workflow:

1. NOTIFY START: "🌅 Starting morning routine..."

[... existing steps ...]

10. NOTIFY COMPLETE: "✅ Morning setup complete! 
    • Calendar reviewed: 4 meetings today
    • Email triaged: 12 messages, 2 urgent
    • Tasks created: 8 priorities set
    • Focus blocks: 3 hours deep work scheduled"
```

**For Weekly Review:**
```markdown
Perfect for notifications since it's a long workflow:

1. NOTIFY START: "📊 Starting weekly review... estimated 15 minutes"

[... data gathering steps ...]

8. NOTIFY PROGRESS: "📈 Data collected, now analyzing patterns..."

[... analysis steps ...]

15. NOTIFY COMPLETE: "✅ Weekly review complete!
    • Achievements: [count] major wins
    • Next week focus: [top 3 priorities]  
    • Time saved this week: [X] hours"
```

**For Focus Mode:**
```markdown
Quick notification for environment setup:

[... setup steps ...]

6. NOTIFY COMPLETE: "🎯 Focus mode activated!
    • Distractions blocked: [apps/sites]
    • Deep work session: [duration] 
    • Next break: [time]"
```

### Notification Best Practices

**Message Structure:**
- **Title**: Keep under 50 chars (shows fully on lock screen)
- **Message**: Lead with key info, details after
- **Emojis**: Use sparingly but effectively (🔄 start, ✅ complete, ⚠️ error)

**Priority Levels:**
- `urgent`: Only for critical errors or time-sensitive items
- `high`: Important completions, meeting changes
- `default`: Most workflow completions
- `low`: Progress updates, minor completions

**Tags for Organization:**
- `complete`: Workflow finished successfully
- `error`: Something went wrong
- `progress`: Intermediate updates
- `morning`, `evening`: Time-based workflows
- `urgent`: Requires immediate attention

### Advanced Integration Examples

**Smart Priority Detection:**
```javascript
// Automatically set priority based on workflow type
const priority = workflowName.includes('urgent') ? 'urgent' : 
                workflowName.includes('morning') ? 'high' : 'default';

await send_notification({
  message: summary,
  priority: priority,
  tags: [workflowType, 'complete']
});
```

**Context-Rich Notifications:**
```javascript
// Include actionable information
await send_notification({
  message: `Meeting prep complete!
    • 3 agenda items prepared
    • Background research: 4 key points
    • Next: Review slides (5 min before meeting)`,
  title: "Meeting: Q4 Planning Ready",
  priority: "high",
  tags: ["meeting", "complete"]
});
```

**Conditional Notifications:**
```javascript
// Only notify if significant results
if (urgentEmails > 0 || meetingsChanged || criticalTasks > 2) {
  await send_notification({
    message: `Morning triage: ${urgentEmails} urgent emails, ${meetingsChanged} schedule changes`,
    priority: urgentEmails > 2 ? "urgent" : "high"
  });
}
```

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

## NTFY Troubleshooting & Best Practices 🔧

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **No notifications received** | • Check ntfy app installed & topic subscribed<br>• Verify `NTFY_TOPIC` env var: `echo $NTFY_TOPIC`<br>• Test manually: `curl -d "test" ntfy.sh/$NTFY_TOPIC` |
| **Delayed notifications** | • Check internet connectivity<br>• Try different ntfy server region<br>• Restart ntfy app |
| **Topic not working** | • Ensure exact topic name match<br>• Use unique topic (avoid common names)<br>• Check for typos in environment variable |
| **Notifications too verbose** | • Use conditional logic for important events only<br>• Batch multiple updates into single notification<br>• Use `low` priority for progress updates |

### Security & Privacy Best Practices

**Topic Naming:**
- ✅ `claude-hub-yourname-x7y9z` (unique + random)
- ✅ `automation-alerts-$(whoami)-$(date +%s)` (dynamic)
- ❌ `claude-notifications` (too generic)
- ❌ `my-alerts` (easily guessable)

**Content Guidelines:**
- ✅ "Customer issue resolved, ticket #1234 closed"
- ✅ "Morning routine complete, 8 tasks processed"
- ❌ "Customer John Smith's payment issue fixed" (PII)
- ❌ "API key rotated: abc123xyz789" (sensitive data)

**Environment Setup:**
```bash
# Add to ~/.zshrc or ~/.bashrc for persistence
export NTFY_TOPIC="claude-automation-$(whoami)-$(openssl rand -hex 4)"

# Test your setup
echo "Topic: $NTFY_TOPIC"
curl -d "Setup test from $(hostname)" "ntfy.sh/$NTFY_TOPIC"
```

### Performance Optimization

**Notification Frequency:**
- **High-value workflows**: Always notify (end-of-day, morning routine)
- **Medium workflows**: Notify on completion only
- **Quick tasks**: Skip notifications or batch them
- **Errors**: Always notify immediately

**Message Optimization:**
```javascript
// Good: Concise but informative
"✅ Weekly review complete! 12 achievements, 3 priorities set for next week"

// Bad: Too verbose
"The weekly review workflow has been completed successfully. During this review, we identified 12 major achievements from this week and have established 3 key priorities for the upcoming week based on..."

// Good: Actionable
"⚠️ Gmail sync failed - manual email check needed before meeting at 3pm"

// Bad: Vague  
"An error occurred during the morning routine workflow"
```

**Batching Strategy:**
```javascript
// Instead of 5 separate notifications, batch into summary
const updates = [];
if (emailsProcessed > 0) updates.push(`${emailsProcessed} emails triaged`);
if (tasksCreated > 0) updates.push(`${tasksCreated} tasks created`);
if (meetingsUpdated > 0) updates.push(`${meetingsUpdated} meetings updated`);

if (updates.length > 0) {
  await send_notification({
    message: `Morning routine complete!\n• ${updates.join('\n• ')}`,
    title: "Claude Hub",
    priority: "default"
  });
}
```

### Advanced Features

**Action Buttons (ntfy Pro feature):**
```javascript
await send_notification({
  message: "Meeting cancelled - 1 hour freed up",
  title: "Schedule Change",
  priority: "high",
  // Add action buttons for quick responses
  actions: [
    { action: "view", label: "Open Calendar", url: "https://calendar.google.com" },
    { action: "http", label: "Extend Current Task", url: "webhook-url" }
  ]
});
```

**Custom Icons & Formatting:**
```javascript
// Use tags for visual categorization
tags: ["calendar", "urgent"]     // 📅🚨
tags: ["complete", "automation"] // ✅🤖  
tags: ["error", "email"]         // ❌📧
```

## General Troubleshooting

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
