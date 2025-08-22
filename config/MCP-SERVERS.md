# MCP Servers Comparison Guide 🔌

A comprehensive guide to available MCP (Model Context Protocol) servers for Claude automation.

## What are MCP Servers?

MCP servers are tools that extend Claude's capabilities beyond text generation. They allow Claude to:
- 📁 Access files on your computer
- 🌐 Interact with web services
- 🗄️ Query databases
- 📧 Manage emails
- 🤖 Automate workflows

## Quick Selection Guide

### By Use Case

| Need | Recommended MCPs | Setup Difficulty |
|------|-----------------|------------------|
| **File Management** | filesystem | ⭐ Easy |
| **Email Automation** | Gmail, Apple Mail | ⭐⭐ Medium |
| **WordPress Management** | wordpress, freescout | ⭐⭐ Medium |
| **Database Queries** | postgres, sqlite | ⭐⭐⭐ Advanced |
| **Browser Automation** | playwright, browsermcp | ⭐⭐ Medium |
| **Team Communication** | slack, whatsapp | ⭐⭐ Medium |
| **Memory & Context** | openmemory, context7 | ⭐ Easy |

### By Technical Level

#### 🟢 Beginner (No coding required)
- filesystem - Local file access
- openmemory - Persistent memory
- apple-reminders - Task management (macOS)

#### 🟡 Intermediate (Some configuration)
- gmail - Email management
- slack - Team messaging
- wordpress - Content management
- freescout - Support tickets

#### 🔴 Advanced (Development experience)
- postgres - Database management
- playwright - Browser automation
- sequential-thinking - Complex reasoning
- automation-hub - Custom tools

## Complete MCP Server Directory

### 📁 File & System Management

#### filesystem
**Purpose:** Read/write local files and directories
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/Documents"]
}
```
**Use Cases:**
- Create and edit documents
- Organize files
- Read configuration files
- Generate reports

**Pros:** Essential for most workflows | **Cons:** Security considerations

---

### 🧠 AI Enhancement

#### openmemory
**Purpose:** Persistent memory across Claude sessions
```json
{
  "command": "npx",
  "args": ["-y", "openmemory"],
  "env": {
    "OPENMEMORY_API_KEY": "om-xxx"
  }
}
```
**Use Cases:**
- Remember user preferences
- Track project context
- Build knowledge base
- Maintain conversation history

**Pros:** Semantic search, unlimited storage | **Cons:** Requires API key

#### context7
**Purpose:** Real-time documentation and code context
```json
{
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
}
```
**Use Cases:**
- Look up library documentation
- Get code examples
- Access API references
- Find best practices

**Pros:** Always up-to-date | **Cons:** Internet required

#### sequential-thinking
**Purpose:** Structured reasoning for complex problems
```json
{
  "command": "uv",
  "args": ["--directory", "~/mcp-sequential-thinking", "run", "server.py"]
}
```
**Use Cases:**
- Multi-step problem solving
- Decision trees
- Complex analysis
- Planning workflows

**Pros:** Better reasoning | **Cons:** Python required

---

### 📧 Communication

#### Gmail
**Purpose:** Gmail email management
```json
{
  "command": "npx",
  "args": ["-y", "@crosshatch/gmail-mcp"],
  "env": {
    "GMAIL_OAUTH_EMAIL": "your-email@gmail.com"
  }
}
```
**Use Cases:**
- Email triage
- Automated responses
- Newsletter management
- Email search

**Pros:** Full Gmail API | **Cons:** OAuth setup required

#### Slack
**Purpose:** Slack workspace integration
```json
{
  "command": "npx",
  "args": ["-y", "slack-mcp-server@latest"],
  "env": {
    "SLACK_MCP_XOXC_TOKEN": "xoxc-xxx",
    "SLACK_MCP_XOXD_TOKEN": "xoxd-xxx"
  }
}
```
**Use Cases:**
- Message posting
- Channel monitoring
- User lookup
- File sharing

**Pros:** Full Slack access | **Cons:** Token extraction needed

#### WhatsApp
**Purpose:** WhatsApp messaging
```json
{
  "command": "uv",
  "args": ["--directory", "~/whatsapp-mcp", "run", "main.py"]
}
```
**Use Cases:**
- Customer communication
- Automated responses
- Message broadcasting
- Contact management

**Pros:** Direct messaging | **Cons:** QR code linking

---

### 🌐 Web & Browser

#### playwright
**Purpose:** Browser automation and testing
```json
{
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```
**Use Cases:**
- Web scraping
- Form filling
- Screenshot capture
- E2E testing

**Pros:** Powerful automation | **Cons:** Resource intensive

#### browsermcp
**Purpose:** Alternative browser automation
```json
{
  "command": "npx",
  "args": ["@browsermcp/mcp@latest"]
}
```
**Use Cases:**
- Simple web interactions
- Page monitoring
- Content extraction
- Link checking

**Pros:** Lighter than Playwright | **Cons:** Fewer features

#### browser-tools
**Purpose:** Advanced browser debugging
```json
{
  "command": "npx",
  "args": ["-y", "@agentdeskai/browser-tools-mcp@latest"]
}
```
**Use Cases:**
- Performance analysis
- SEO auditing
- Console monitoring
- Network inspection

**Pros:** Developer focused | **Cons:** Technical knowledge needed

---

### 💼 Business Tools

#### wordpress
**Purpose:** WordPress content management
```json
{
  "command": "node",
  "args": ["/path/to/mcp-wp/build/server.js"],
  "env": {
    "WORDPRESS_API_URL": "https://site.com",
    "WORDPRESS_USERNAME": "user",
    "WORDPRESS_PASSWORD": "pass"
  }
}
```
**Use Cases:**
- Content publishing
- User management
- Plugin control
- Media handling

**Pros:** Full WP API | **Cons:** Build from source

#### freescout
**Purpose:** Customer support management
```json
{
  "command": "npx",
  "args": ["@verygoodplugins/mcp-freescout@latest"],
  "env": {
    "FREESCOUT_URL": "https://support.site.com",
    "FREESCOUT_API_KEY": "xxx"
  }
}
```
**Use Cases:**
- Ticket management
- Customer analytics
- Reply drafting
- Support automation

**Pros:** Helpdesk integration | **Cons:** FreeScout instance needed

#### stripe
**Purpose:** Payment processing
```json
{
  "command": "npx",
  "args": ["-y", "@crosshatch/stripe-mcp"],
  "env": {
    "STRIPE_API_KEY": "sk_xxx"
  }
}
```
**Use Cases:**
- Payment monitoring
- Customer lookup
- Subscription management
- Revenue reporting

**Pros:** Financial automation | **Cons:** Live API key risks

---

### 🗄️ Databases

#### postgres
**Purpose:** PostgreSQL database access
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/db"]
}
```
**Use Cases:**
- Data queries
- Report generation
- Schema management
- Data analysis

**Pros:** Full SQL support | **Cons:** Database knowledge required

---

### 🍎 Apple Ecosystem (macOS only)

#### apple-reminders
**Purpose:** macOS Reminders integration
```json
{
  "command": "mcp-server-apple-reminders"
}
```
**Use Cases:**
- Task creation
- List management
- Due date tracking
- Location reminders

**Pros:** Native integration | **Cons:** macOS only

#### apple-notes
**Purpose:** Apple Notes management
```json
{
  "command": "mcp-server-apple-notes"
}
```
**Use Cases:**
- Note creation
- Note search
- Folder organization
- Rich text editing

**Pros:** iCloud sync | **Cons:** macOS only

---

### 🚀 Deployment & DevOps

#### flyctl
**Purpose:** Fly.io deployment management
```json
{
  "command": "/opt/homebrew/bin/fly",
  "args": ["mcp", "server"]
}
```
**Use Cases:**
- App deployment
- Scaling management
- Log viewing
- Secret management

**Pros:** Full deployment control | **Cons:** Fly.io account needed

#### sentry
**Purpose:** Error tracking and monitoring
```json
{
  "url": "https://mcp.sentry.dev/sse"
}
```
**Use Cases:**
- Error monitoring
- Performance tracking
- Release management
- Alert configuration

**Pros:** Production insights | **Cons:** Sentry account required

---

### 🔧 Custom Tools

#### automation-hub
**Purpose:** Hot-reloadable custom tools
```json
{
  "command": "node",
  "args": ["./node_modules/mcp-reloader/dist/server.js"],
  "env": {
    "NTFY_TOPIC": "notifications"
  }
}
```
**Use Cases:**
- Custom workflows
- Mobile notifications
- Workflow scheduling
- Tool development

**Pros:** Fully customizable | **Cons:** Development required

---

## Selection Criteria

### Consider These Factors:

1. **Technical Skill Level**
   - Beginner: Start with filesystem, openmemory
   - Intermediate: Add communication tools
   - Advanced: Include databases, automation

2. **Security Requirements**
   - Low risk: filesystem (read-only), context7
   - Medium risk: email, communication tools
   - High risk: databases, payment systems

3. **Use Case Priority**
   - Content creation: wordpress, filesystem
   - Development: postgres, playwright, context7
   - Business: freescout, stripe, slack
   - Personal: apple ecosystem, gmail

4. **Setup Complexity**
   - Easy: NPX-based tools (instant)
   - Medium: API key configuration
   - Hard: Token extraction, OAuth

5. **Resource Usage**
   - Light: filesystem, openmemory
   - Medium: slack, gmail
   - Heavy: playwright, postgres

## Recommended Combinations

### The Minimalist (3 MCPs)
```
filesystem + openmemory + gmail
```
Perfect for: Basic automation, email management

### The WordPress Developer (5 MCPs)
```
filesystem + wordpress + freescout + openmemory + context7
```
Perfect for: Content management, support

### The Full Stack Developer (7 MCPs)
```
filesystem + postgres + playwright + context7 + openmemory + github + slack
```
Perfect for: Complete development workflow

### The Business Owner (6 MCPs)
```
filesystem + gmail + slack + wordpress + stripe + freescout
```
Perfect for: Business operations

### The Power User (10+ MCPs)
```
All of the above + automation-hub + sequential-thinking
```
Perfect for: Maximum automation

## Installation Tips

### Quick Install Commands

```bash
# Essential pack
npm install -g @modelcontextprotocol/server-filesystem
npm install -g openmemory

# Communication pack
npm install -g @crosshatch/gmail-mcp
npm install -g slack-mcp-server

# Development pack
npm install -g @modelcontextprotocol/server-postgres
npm install -g @playwright/mcp
npm install -g @upstash/context7-mcp

# WordPress pack
npm install -g @verygoodplugins/mcp-freescout
git clone https://github.com/verygoodplugins/mcp-wp
```

## Performance Considerations

| MCP Server | Memory Usage | CPU Impact | Startup Time |
|------------|--------------|------------|--------------|
| filesystem | Low (10MB) | Minimal | Instant |
| openmemory | Low (20MB) | Minimal | 1-2s |
| gmail | Medium (50MB) | Low | 2-3s |
| slack | Medium (60MB) | Low | 2-3s |
| wordpress | Medium (40MB) | Low | 1-2s |
| postgres | Medium (80MB) | Medium | 2-3s |
| playwright | High (200MB) | High | 5-10s |
| sequential-thinking | Medium (100MB) | Medium | 3-5s |

## Security Recommendations

### Risk Levels

🟢 **Low Risk**
- filesystem (read-only mode)
- context7
- apple-reminders

🟡 **Medium Risk**
- gmail
- slack
- wordpress (with app passwords)
- openmemory

🔴 **High Risk**
- postgres (database access)
- stripe (payment access)
- filesystem (write mode)

### Best Practices

1. **Start with read-only permissions**
2. **Use application passwords, not main passwords**
3. **Rotate API keys regularly**
4. **Limit MCP access to specific directories**
5. **Review logs periodically**
6. **Use project-specific configurations**

## Troubleshooting Guide

### Common Issues

| Problem | Solution |
|---------|----------|
| MCP not connecting | Check npx/node installation |
| Permission denied | Add to allow list in settings |
| API key invalid | Verify key format and permissions |
| High memory usage | Disable unused MCPs |
| Slow performance | Reduce active MCP count |

### Debug Commands

```bash
# Test MCP connection
npx -y @modelcontextprotocol/server-filesystem ~/Documents

# Check Claude logs
tail -f ~/Library/Logs/Claude/*.log

# Verify node/npm
node --version && npm --version

# Test specific MCP
npx -y openmemory --test
```

---

Built with 🧡 by [Very Good Plugins](https://verygoodplugins.com) for the open source community