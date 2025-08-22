# Claude Automation Hub - Slack Workflow Steps Setup Guide

## ✅ What I've Already Set Up For You

1. **Cloudflare Tunnel Configuration** (`cloudflare-tunnel/config.yml`)
   - Ready to expose your local automation hub to Slack
   - Configured for `automation.wpfusion.com` subdomain

2. **Setup Scripts**
   - `setup-tunnel.sh` - One-time tunnel setup
   - `start-tunnel.sh` - Start the tunnel
   - LaunchAgent for auto-start on Mac

3. **Workflow Steps Server** (`workflow-steps-server.js`)
   - 6 pre-built workflow steps for your MCP tools
   - Ready to integrate with WP Fusion, Very Good Plugins, FreeScout

## 🔧 What You Need to Do Now

### Step 1: Set Up Cloudflare Tunnel (5 minutes)

```bash
cd /Users/jgarturo/Projects/OpenAI/claude-automation-hub/cloudflare-tunnel

# Make scripts executable
chmod +x setup-tunnel.sh start-tunnel.sh

# Run the setup (you'll authenticate with Cloudflare)
./setup-tunnel.sh
```

**When prompted, add this DNS record in Cloudflare:**
- Type: CNAME
- Name: automation
- Target: [your-tunnel-id].cfargotunnel.com
- Proxy: ON (orange cloud)

### Step 2: Configure Slack App URLs

In your Slack app settings, add these URLs:

**Event Subscriptions:**
- Request URL: `https://automation.wpfusion.com/slack/events`

**Interactivity & Shortcuts:**
- Request URL: `https://automation.wpfusion.com/slack/interactive`

**Workflow Steps:**
- Request URL: `https://automation.wpfusion.com/slack/workflow`

### Step 3: Set Environment Variables

Create `.env` file in claude-automation-hub:
```bash
SLACK_SIGNING_SECRET=your_signing_secret_here
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_USER_TOKEN=xoxp-your-user-token
```

### Step 4: Install as Service (Optional)

To run tunnel automatically on startup:
```bash
# Copy LaunchAgent
cp com.claude.automation.tunnel.plist ~/Library/LaunchAgents/

# Load the service
launchctl load ~/Library/LaunchAgents/com.claude.automation.tunnel.plist
```

## 🎯 Your 6 Pre-Built Workflow Steps

### 1. **Create WP Fusion Post**
- Publishes content directly to wpfusion.com
- Returns post ID and URL
- Perfect for release notes, updates

### 2. **Create VGP Documentation**
- Creates docs on verygoodplugins.com
- Categorizes by product
- Returns doc URL

### 3. **Create Support Ticket**
- Creates FreeScout ticket from Slack
- Sets priority and assignment
- Returns ticket URL

### 4. **AI Channel Summary**
- Summarizes last N messages
- Extracts action items
- Uses Claude via MCP

### 5. **Save to OpenMemory**
- Stores important decisions
- Categorizes information
- Searchable later

### 6. **Send Automation Alert**
- Sends push notifications
- Different priority levels
- Via your ntfy setup

## 🚀 How to Add These Steps in Slack

1. Go to **Workflow Steps** in your Slack app
2. Click **Add Step**
3. For each step, configure:
   - Step name (from list above)
   - Callback ID (from workflow-steps-server.js)
   - Input/Output parameters

## 📊 Example Workflow Combinations

### **Customer Support Flow**
1. Message arrives → Create FreeScout ticket
2. Ticket created → Send notification
3. Resolution → Update WordPress docs
4. Complete → Save to memory

### **Content Publishing Flow**
1. Draft in Slack → AI summarize
2. Summary → Create WP Fusion post
3. Post created → Send notification
4. Published → Update VGP docs

### **Team Decision Flow**
1. Discussion → AI extract decisions
2. Decisions → Save to memory
3. Action items → Create tickets
4. Complete → Send summary

## 🔌 Testing Your Setup

1. **Test Tunnel:**
   ```bash
   curl https://automation.wpfusion.com/health
   ```

2. **Test Workflow Step:**
   - Create a simple workflow in Slack
   - Add one of your custom steps
   - Run the workflow

3. **Check Logs:**
   ```bash
   tail -f ~/Projects/OpenAI/claude-automation-hub/cloudflare-tunnel/tunnel.log
   ```

## 💡 Pro Tips

- Use **dynamic prompts** in AI Apps settings for context-aware suggestions
- Combine multiple steps for powerful automations
- Your MCP tools can be called directly from the workflow steps
- The tunnel stays active even when your laptop sleeps (if using LaunchAgent)

## Need Help?

- Cloudflare tunnel issues: Check tunnel.log
- Slack verification: Ensure signing secret is correct
- MCP integration: Verify your MCP servers are running

Ready to create powerful automations! 🚀
