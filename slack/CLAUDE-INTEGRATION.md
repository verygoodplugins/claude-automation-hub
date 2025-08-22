# 🤖 Claude AI Slack Integration Guide

## ✅ **SETUP COMPLETE!**

Your Slack-Claude-MCP integration is now live! You can talk to Claude directly from Slack, and Claude can execute tasks on your local machine using MCP tools.

## 🎯 **How to Use**

### In Slack, type:

#### Get Help
```
/auto-jack help
```
Shows all available commands and capabilities.

#### Talk to Claude
```
/auto-jack what's the weather like today?
/auto-jack summarize my recent emails
/auto-jack check my calendar for tomorrow
/auto-jack create a reminder to review PRs at 3pm
```

#### Advanced Commands
```
/auto-jack analyze the last 10 support tickets and create a summary
/auto-jack search for documentation about authentication
/auto-jack send me a notification when the build completes
/auto-jack create a blog post about our new feature
```

## 🔧 **What Claude Can Do**

### With MCP Tools:
- 📧 **Email & Calendar**: Read emails, check calendar, schedule meetings
- 🎫 **Support Tickets**: Analyze FreeScout tickets, create responses
- 📝 **Content Creation**: Write WordPress posts, manage media
- 🔍 **Search**: Search web, files, documentation
- 📱 **Notifications**: Send mobile alerts via NTFY
- 🧠 **Memory**: Remember context with OpenMemory
- 📂 **Files**: Read and write local files (with approval)
- 🔧 **Git**: Check status, create commits (with approval)
- 🌐 **Browser**: Take screenshots, open URLs
- 💾 **Database**: Query PostgreSQL databases

## 🚀 **Testing Your Integration**

### 1. **Test Basic Response**
In Slack:
```
/auto-jack hello
```
Expected: Claude responds with a greeting

### 2. **Test Tool Execution**
```
/auto-jack what's the current date and time?
```
Expected: Claude responds with current date/time

### 3. **Test File Reading**
```
/auto-jack read the README.md file
```
Expected: Claude reads and summarizes the README

### 4. **Test Notifications**
```
/auto-jack send me a test notification
```
Expected: You receive a mobile notification (if NTFY configured)

## 🔐 **Security Features**

- ✅ All requests are authenticated with Slack signatures
- ✅ Dangerous operations require approval
- ✅ File access is limited to project directory
- ✅ Commands are logged for audit
- ✅ API keys are stored securely in .env

## 🛠️ **Configuration**

### Environment Variables (`.env`)
```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...  # Your Claude API key
SLACK_BOT_TOKEN=xoxb-...      # Slack bot token
SLACK_SIGNING_SECRET=...       # Slack signing secret

# Optional
NTFY_TOPIC=...                 # For mobile notifications
NODE_ENV=development           # Enable debug logging
```

### Customizing Claude's Behavior

Edit `src/services/claude-service.js` to:
- Change Claude's personality/tone
- Add new MCP tools
- Modify response formatting
- Adjust token limits

### Adding New MCP Tools

1. Add tool definition in `claude-service.js`:
```javascript
{
  name: 'your_tool',
  description: 'What it does',
  input_schema: { ... }
}
```

2. Implement in `mcp-executor.js`:
```javascript
async yourTool(params) {
  // Tool implementation
  return { message: 'Result' };
}
```

## 📊 **Monitoring**

### View Logs
```bash
# Watch server logs
tail -f slack/debug/server.log

# Check Claude interactions
grep "Claude" slack/debug/server.log

# Monitor token usage
grep "Tokens used" slack/debug/server.log
```

### Debug Mode
Enable detailed logging:
```bash
NODE_ENV=development node src/proxy/cursor-web-proxy.js
```

## 🐛 **Troubleshooting**

### Claude Not Responding
1. Check API key is valid: `echo $ANTHROPIC_API_KEY`
2. Check server is running: `lsof -i :8765`
3. Check tunnel is active: `curl https://automation.verygoodplugins.com/health`

### "dispatch_failed" Error
- Ensure server is running
- Check tunnel is connected
- Verify Slack app URLs are correct

### Claude Says "API key not configured"
- Add `ANTHROPIC_API_KEY` to `.env`
- Restart the server

### Tools Not Working
- Check MCP tool implementation in `mcp-executor.js`
- Verify tool permissions
- Check error logs

## 🎉 **Success!**

Your Slack workspace now has an AI assistant that can:
- Answer questions intelligently
- Execute tasks on your machine
- Integrate with all your tools
- Learn and remember context
- Automate workflows

## 🚦 **Next Steps**

1. **Test in Slack**: Try `/auto-jack help`
2. **Explore capabilities**: Ask Claude to do various tasks
3. **Customize tools**: Add your specific MCP integrations
4. **Share with team**: Let others use the AI assistant
5. **Build workflows**: Create complex automation chains

## 📚 **Resources**

- [Anthropic API Docs](https://docs.anthropic.com)
- [Slack API Docs](https://api.slack.com)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Project README](../README.md)

---

**Congratulations!** You've built a powerful AI automation system that connects Slack, Claude, and your entire tool ecosystem! 🎊