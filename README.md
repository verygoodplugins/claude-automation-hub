# Claude Automation Hub 🤖

Your personal command center for Claude Desktop + MCP automations. Version-controlled, searchable, and constantly evolving.

## Quick Start

Copy any command from the `workflows/` directory and paste into Claude to run.

## Current Integrations

- ✅ **FreeScout** - Support ticket management
- ✅ **Stripe** - Payment and subscription data  
- ✅ **Cloudflare** - KV, R2, D1, Workers
- ✅ **Gmail** - Email search and analysis
- ✅ **Google Calendar** - Event management
- ✅ **Filesystem** - Local file operations
- ✅ **Spotify** - Music control
- ✅ **Brave Browser** - Web automation

## Stats (as of August 2025)

- **Active Workflows**: 12
- **Time Saved Weekly**: 20+ hours
- **High-Value Automations**: Support triage, payment recovery, tax prep
- **Integration Coverage**: 8/15 possible MCPs

## Top 5 Most Used Workflows

1. [Morning Support Triage](workflows/daily/morning-triage.md) - Run daily
2. [Payment Failed Recovery](workflows/daily/payment-recovery.md) - Run daily
3. [Weekly Support Report](workflows/weekly/support-analytics.md) - Run Fridays
4. [Mastermind Prep](workflows/weekly/mastermind-prep.md) - Run Thursdays
5. [Customer Research](workflows/on-demand/customer-research.md) - As needed

## Workflow Categories

- **Daily** - Routine morning/evening tasks
- **Weekly** - Scheduled reports and reviews
- **Monthly** - Financial and strategic planning  
- **On-Demand** - Triggered by specific needs

## Contributing New Workflows

1. Test the workflow in Claude
2. Document in appropriate category
3. Include time saved estimate
4. Commit with descriptive message
5. Share wins in mastermind!

## Security Notes

- Never commit API keys (use .gitignore)
- Sanitize customer data in examples
- Keep sensitive workflows in private branch

## Workflow Generator

Ask Claude: "Look at my automation hub and suggest 5 new workflows I haven't tried yet based on my available integrations."
