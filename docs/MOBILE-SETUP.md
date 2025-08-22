# Mobile Notification Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up ntfy Topic
```bash
# Choose a unique topic name (replace with your own)
export NTFY_TOPIC="claude-automation-alerts-$(whoami)-$(date +%s)"

# Add to your shell profile for persistence
echo "export NTFY_TOPIC=\"$NTFY_TOPIC\"" >> ~/.zshrc
source ~/.zshrc
```

### 3. Install ntfy App on Mobile
- **iOS**: [App Store - ntfy](https://apps.apple.com/us/app/ntfy/id1625396347)
- **Android**: [Google Play - ntfy](https://play.google.com/store/apps/details?id=io.heckel.ntfy)

### 4. Subscribe to Your Topic
1. Open ntfy app
2. Tap "+" to add subscription
3. Enter your topic name: `claude-automation-alerts-yourname-timestamp`
4. Subscribe

### 5. Test the System
```bash
npm run test-mobile
```

### 6. Set Up openmemory API Key
1. Get your API key from [OpenMemory Dashboard](https://app.openmemory.dev/dashboard)
2. Update config/mcp-claude-desktop.json:
```json
{
  "mcpServers": {
    "openmemory": {
      "env": {
        "OPENMEMORY_API_KEY": "your_actual_api_key_here",
        "CLIENT_NAME": "claude"
      }
    }
  }
}
```

## Usage Examples

### From Claude Desktop
```
Hey Claude, run my end-of-day shutdown routine with mobile notifications
```

### Manual Testing
```javascript
import AutomationHub from '../src/automation-hub.js';

const hub = new AutomationHub();

// Test end-of-day
await hub.endOfDayShutdown({
  achievements: ['Built mobile notification system'],
  tomorrowFocus: 'Test workflows'
});

// Test meeting change
await hub.notifyMeetingChange({
  title: 'Team standup',
  time: '10:00 AM',
  duration: '30min'
}, 'cancelled');
```

## What Happens When Mobile MCP Launches

When Anthropic releases mobile MCP support, you'll be able to:

1. **Receive rich notifications** on mobile
2. **Open Claude iOS** and ask:
   - "What's my current context?"
   - "What should I do with the freed 30 minutes?"
   - "What are my priorities right now?"
3. **Claude iOS will have full context** from your desktop automation
4. **Take actions** based on the mobile action suggestions

## Current State vs Future

### ✅ Ready Now
- Rich context storage in openmemory
- Mobile notifications via ntfy
- Structured handoff patterns
- Action suggestion framework

### 🔄 When Mobile MCP Arrives
- Direct Claude iOS access to contexts
- Seamless cross-device AI conversations
- Mobile-triggered actions
- True federated AI workflows

## Troubleshooting

### No notifications received?
```bash
# Test manual notification
curl -d "Test message" ntfy.sh/$NTFY_TOPIC

# Check environment
echo $NTFY_TOPIC
```

### Can't run test?
```bash
# Check Node.js version (need 18+)
node --version

# Install dependencies
npm install

# Check file permissions
chmod +x test-mobile.js
```

---

🎉 **You're now ready for the mobile AI future!**
