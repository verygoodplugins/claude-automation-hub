# Claude Automation Hub 🤖

**Transform your daily tasks into automated workflows using Claude Desktop, Claude Code, and Cursor IDE**

## About This Project

Hi! I'm Jack Arturo, founder of [Very Good Plugins](https://verygoodplugins.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub). We're the team behind [WP Fusion](https://wpfusion.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub), and we've spent years helping businesses automate their WordPress workflows.

**But here's the thing:** We believe the best tools should be free and accessible to everyone.

That's why we're sharing everything we've learned about AI automation - the exact workflows that save us 60+ hours every month. No gatekeeping, no "premium" versions, just practical automation that actually works.

> "We're living proof that a small team with some questionable ideas and too much caffeine can build something that actually works." - From our [blog post about replacing $2,000/month in SaaS tools](https://wpfusion.com/business/we-built-4-tools-to-fix-our-support-pipeline-and-you-can-have-them-for-free/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)

### Watch: AI Automation in Action

[![AI Automation with Claude and MCP](https://img.youtube.com/vi/CVHlPDXGMmY/maxresdefault.jpg)](https://www.youtube.com/watch?v=CVHlPDXGMmY)

*Click to watch how we use Claude Desktop and MCP servers to automate our entire support pipeline*

---

<div align="center">
  <h3>🚀 New: EchoDash - AI-Powered Analytics Platform</h3>
  
  <a href="https://echodash.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub&utm_content=logo">
    <img src="https://verygoodplugins.com/wp-content/themes/verygoodplugins-com/img/echodash-logo.svg" alt="EchoDash" width="180" style="margin: 20px 0;">
  </a>
  
  <p><strong>Transform your data into actionable insights with cutting-edge AI technology</strong></p>
  
  <p>Impressed with what we're doing with AI automation? You'll love <strong>EchoDash</strong> - our new AI-powered intelligence platform, now in limited beta.</p>
  
  <a href="https://echodash.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub&utm_content=cta_button">
    <img src="https://img.shields.io/badge/🎯_Sign_Up_Free-Limited_Beta_Access-7c3aed?style=for-the-badge&labelColor=667eea" alt="Sign up for EchoDash Beta">
  </a>
</div>

---

### Our Philosophy

- 🎯 **No technical background required** - If you can copy and paste, you can automate
- 🛠️ **Built by a small team** that's saved thousands of hours through automation
- 🌍 **Open source forever** - Part of our commitment to sharing what we've learned
- 🚀 **Actually tested** - Every workflow here runs in our production environment

## 📚 Documentation & Community

### [📖 Read the Wiki](https://github.com/verygoodplugins/claude-automation-hub/wiki)
Comprehensive guides for all skill levels:
- [Getting Started in 15 Minutes](https://github.com/verygoodplugins/claude-automation-hub/wiki/Getting-Started)
- [First Automation Tutorial](https://github.com/verygoodplugins/claude-automation-hub/wiki/First-Automation)
- [Complete Workflow Library](https://github.com/verygoodplugins/claude-automation-hub/wiki/Workflow-Library)
- [Time & Cost Calculations](https://github.com/verygoodplugins/claude-automation-hub/wiki/Time-Calculations)

### [💬 Join the Discussion](https://github.com/verygoodplugins/claude-automation-hub/discussions)
Connect with the community:
- [Ask Questions](https://github.com/verygoodplugins/claude-automation-hub/discussions/categories/q-a) - Get help with setup and troubleshooting
- [Share Your Workflows](https://github.com/verygoodplugins/claude-automation-hub/discussions/categories/show-and-tell) - Show what you've automated
- [Browse Ideas](https://github.com/verygoodplugins/claude-automation-hub/discussions/categories/ideas) - See what others are building

## What You'll Get 🎯

- **Save 10+ hours per week** with automated workflows
- **Pre-built workflows** for common tasks (morning routine, weekly reviews, reports)
- **Simple copy-paste commands** that work immediately
- **No coding required** - just configuration files and natural language

## Quick Start (15 minutes) ⚡

### Step 1: Install Claude Desktop
Download [Claude Desktop](https://claude.ai/download) - your AI assistant that can connect to external tools.

### Step 2: Choose Your Tools (MCPs)
MCPs (Model Context Protocol servers) let Claude interact with your favorite services. Pick 2-3 to start:

**Recommended Starter Pack:**
- 📧 **[Gmail](https://github.com/crosshatch/gmail-mcp)** - Manage emails and search messages
- 📅 **[Google Calendar](https://github.com/crosshatch/calendar-mcp)** - Check schedule and create events  
- 📝 **[Apple Notes](https://github.com/crosshatch/apple-mcp)** - Create and search notes
- 💾 **[Filesystem](https://modelcontextprotocol.io/docs/tools/filesystem)** - Read and write local files

### Step 3: Configure Your Tools
1. Copy the example configuration:
   ```bash
   cp config/claude_desktop_config-example.json ~/.claude/claude_desktop_config.json
   ```

2. Edit the file and add your chosen MCPs. Here's a minimal example:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/Documents"]
       },
       "gmail": {
         "command": "npx",
         "args": ["-y", "@crosshatch/gmail-mcp"],
         "env": {
           "GMAIL_OAUTH_EMAIL": "your-email@gmail.com"
         }
       }
     }
   }
   ```

3. Restart Claude Desktop

### Step 4: Try Your First Workflow
Open Claude Desktop and paste this command:

```
Create my morning briefing:
1. Check my Gmail for any emails from the last 12 hours
2. Look at my calendar for today's meetings
3. Create a summary with key priorities
4. Save it as a markdown file on my desktop
```

**That's it!** Claude will execute each step and create your morning briefing. 🎉

## Pre-Built Workflows 📚

We've included 20+ tested workflows that save hours every week. Each workflow is a simple markdown file with copy-paste commands.

### Daily Workflows (Save 2+ hours/day)
- **[Morning Routine](workflows/daily/morning-routine.md)** - Start your day with automated email triage, calendar review, and priority setting
- **[End of Day Shutdown](workflows/daily/end-of-day-shutdown.md)** - Wrap up tasks, prepare tomorrow's schedule, send status updates

### Weekly Workflows (Save 5+ hours/week)
- **[Weekly Review](workflows/weekly/review-planning.md)** - Analyze your week's accomplishments and plan ahead
- **[Meeting Prep](workflows/on-demand/meeting-preparation.md)** - Research attendees, gather context, create agendas

### On-Demand Workflows
- **[Focus Mode](workflows/on-demand/focus-mode.md)** - Block distractions and optimize your environment
- **[Project Initialization](workflows/on-demand/project-initialization.md)** - Set up new projects with proper structure
- **[Customer Research](workflows/on-demand/customer-communication-hub.md)** - Aggregate customer interactions across channels

## How Workflows Work 🔧

Each workflow is just a markdown file with:
1. **A command to paste** into Claude Desktop
2. **Required MCPs** (the tools Claude needs)
3. **Time saved** (measured from real usage)
4. **Variables you can customize**

Example from [Morning Routine](workflows/daily/morning-routine.md):
```markdown
## Command
Check my Gmail inbox, summarize important emails, 
check calendar for today, create a priority list

## Prerequisites
- Gmail MCP
- Calendar MCP
- Filesystem MCP

## Time Saved
Manual: 30 minutes → Automated: 2 minutes
```

## Creating Your Own Workflows ✨

1. **Identify a repetitive task** you do regularly
2. **List the steps** you take manually
3. **Note which tools** you use (email, calendar, files, etc.)
4. **Write a natural language command** describing the process
5. **Test in Claude Desktop** and refine

Use our helper script to create a new workflow:
```bash
./scripts/add-workflow.sh daily "expense-report" "Generate weekly expense report from receipts"
```

## Scheduling Workflows (Optional) ⏰

Want workflows to run automatically? Add scheduling to any workflow:

1. **Install the scheduler** (one-time setup):
   ```bash
   npm install
   npm run setup:scheduler
   ```

2. **Configure schedules** in `src/scheduler/workflow-scheduler.js`:
   ```javascript
   schedules: [
     { 
       name: 'morning-routine',
       time: '07:00',
       days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
     }
   ]
   ```

3. **Run the scheduler**:
   ```bash
   npm run scheduler
   ```

Your workflows will now run automatically at the specified times!

## Available MCP Integrations 🔌

Start with 2-3 MCPs, then add more as needed:

### Productivity
- ✅ **Gmail** - Email management and search
- ✅ **Google Calendar** - Schedule and event management
- ✅ **Apple Notes/Reminders** - Native macOS integration
- ✅ **Filesystem** - Local file operations

### Communication
- ✅ **Slack** - Team messaging ([mcp-slack](https://github.com/crosshatch/mcp-slack))
- ✅ **WhatsApp** - Customer communication ([mcp-whatsapp](https://github.com/crosshatch/mcp-whatsapp))

### Development
- ✅ **GitHub** - Repository and issue management (via `gh` CLI)
- ✅ **PostgreSQL** - Database queries ([mcp-postgres](https://github.com/crosshatch/mcp-postgres))

### Business Tools
- ✅ **Stripe** - Payment and subscription data ([mcp-stripe](https://github.com/crosshatch/mcp-stripe))
- ✅ **Google Drive/Docs** - Document management ([mcp-gdrive](https://github.com/crosshatch/mcp-gdrive))
- ✅ **FreeScout** - Support ticket management ([mcp-freescout](https://github.com/verygoodplugins/mcp-freescout?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub))

See [config/README.md](config/README.md) for setup instructions for each MCP.

## Tips for Success 🚀

1. **Start small** - Pick one workflow and use it for a week
2. **Customize gradually** - Modify commands to match your needs
3. **Track time saved** - Notice how much faster tasks complete
4. **Share workflows** - What works for you might help others

## Part of Our AI Automation Series 📚

This project is part of our weekly series on AI automation and business process optimization. Every week, we share new tools, workflows, and insights from running a fully automated support pipeline.

### 🎯 Latest Project: EchoDash

We're taking everything we've learned about AI automation and building [EchoDash](https://echodash.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub&utm_content=series_mention) - an AI-powered analytics platform that transforms your data into actionable insights. Currently in limited beta, it's the perfect complement to your automation workflows.

**[→ Join the EchoDash Beta (Free)](https://echodash.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub&utm_content=beta_signup)**

### Follow Along:
- 📝 **[Read our blog](https://wpfusion.com/blog/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)** - Weekly posts on automation and efficiency
- 🛠️ **[Check our GitHub](https://github.com/verygoodplugins?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)** - New open source tools every month
- 🎥 **[Watch tutorials](https://www.youtube.com/@verygoodplugins?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)** - Video walkthroughs and demos

### Recent Posts in This Series:
- [We Built 4 Tools to Fix Our Support Pipeline](https://wpfusion.com/business/we-built-4-tools-to-fix-our-support-pipeline-and-you-can-have-them-for-free/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)
- [How We Replaced $2,000/Month in SaaS with Open Source](https://wpfusion.com/blog/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)
- [MCP Servers: The Future of AI Integration](https://wpfusion.com/blog/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)

## Support & Community 🤝

- **📖 Documentation:** [Read the Wiki](https://github.com/verygoodplugins/claude-automation-hub/wiki)
- **💬 Community:** [GitHub Discussions](https://github.com/verygoodplugins/claude-automation-hub/discussions)
- **🐛 Issues:** [Report Bugs](https://github.com/verygoodplugins/claude-automation-hub/issues)
- **📺 Videos:** [YouTube Tutorials](https://www.youtube.com/@verygoodplugins) (Coming Soon)
- **🐦 Updates:** [Twitter/X](https://twitter.com/verygoodplugins?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)

---

## Advanced Features (Experimental) 🧪

Once you're comfortable with basic workflows, explore these advanced capabilities:

### Hot-Reloadable Custom Tools
Create custom MCP tools without restarting Claude:
- See [TOOLS-GUIDE.md](docs/TOOLS-GUIDE.md) for development guide
- Uses `mcp-reloader` for instant tool updates
- Example tools in `tools/` directory

### Mobile Notifications (NTFY)
Get workflow results on your phone:
- Setup guide: [MOBILE-SETUP.md](docs/MOBILE-SETUP.md)
- Requires NTFY app and topic configuration
- Bundles notifications intelligently

### Cursor IDE Integration
Deep linking between Claude and your code editor:
- [Clickable Links Setup](docs/clickable-links-setup.md)
- Web proxy for sandboxed environments
- Direct file opening from Claude

### Window Management (Yabai)
Optimize your development environment:
- [🖨️ Printable Yabai Cheat Sheet](docs/yabai-cheatsheet.html) - One-page reference for desk use
- [Complete Yabai Setup Guide](config/yabai/README.md)
- Automated window tiling and workspace management

### Dashboard & Analytics
Track your automation metrics:
- [DASHBOARD.md](docs/DASHBOARD.md) - View time saved and usage patterns
- Built-in analytics tools
- ROI tracking for workflows

### Testing Infrastructure
Comprehensive testing for workflows:
- [TESTING-GUIDE.md](docs/TESTING-GUIDE.md)
- Test individual components
- Validate workflow chains

## Architecture (For Developers) 🏗️

```
claude-automation-hub/
├── workflows/          # Pre-built workflow templates
│   ├── daily/         # Daily recurring tasks
│   ├── weekly/        # Weekly reviews and planning
│   └── on-demand/     # Triggered as needed
├── config/            # MCP configuration examples
├── tools/             # Custom hot-reloadable tools
├── src/               # Core automation logic
│   ├── scheduler/     # Workflow scheduling system
│   └── notifications/ # Mobile notification system
└── docs/              # Additional documentation
```

---

## About Very Good Plugins

[Very Good Plugins](https://verygoodplugins.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub) builds automation tools that help businesses save time and money. Our flagship product, [WP Fusion](https://wpfusion.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub), connects WordPress to 100+ marketing and CRM platforms.

**🆕 Latest Innovation:** [EchoDash](https://echodash.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub&utm_content=footer) - AI-powered analytics platform (Limited Beta)

We're committed to:
- 🌍 **Open source development** - Sharing our tools and knowledge freely
- 🛠️ **Practical automation** - Building things that actually work in production
- 👥 **Community first** - Learning and growing together

### Connect With Us:
- 🌐 [Visit our website](https://verygoodplugins.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)
- 📧 [Subscribe to our newsletter](https://wpfusion.com/blog/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)
- 🐦 [Follow on Twitter/X](https://twitter.com/verygoodplugins?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)
- 💼 [LinkedIn](https://www.linkedin.com/company/verygoodplugins?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub)

## License

MIT - See [LICENSE](LICENSE) file

Copyright © 2025 Very Good Plugins, LLC

---

**Ready to save hours every week?** Start with the [Quick Start](#quick-start-15-minutes-) above! 🚀

*Built with 🧡 by the team at [Very Good Plugins](https://verygoodplugins.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-automation-hub) for the open source community*