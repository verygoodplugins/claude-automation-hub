# Slack Integration Debugging Guide

## Common Issue: "dispatch_failed" Error

### Root Cause
The "dispatch_failed" error occurs when Slack cannot reach your local server through the configured webhook URL. This typically happens when:

1. **Local server is not running** - The Node.js server isn't active
2. **Cloudflare tunnel is down** - The tunnel connecting your local server to the public URL isn't running
3. **Incorrect webhook URLs** - Slack app configuration points to wrong endpoints
4. **Signature verification failing** - Missing or incorrect signing secret

## Quick Fix

### Step 1: Start Everything in Debug Mode
```bash
# Start both server and tunnel with detailed logging
bash slack/debug/start-debug.sh --with-tunnel
```

This starts:
- Main server on port 8765 with enhanced logging
- Debug monitor on port 8766 to capture all events
- Cloudflare tunnel for public access

### Step 2: Verify Everything is Running
```bash
# Run the connection test
node slack/debug/test-slack-connection.js
```

You should see:
- ✅ Bot token authenticated
- ✅ Local server is running
- ✅ Public URL is accessible
- ✅ Slack API permissions verified

### Step 3: Test Your Slash Command
In Slack, type:
```
/auto-jack test
```

Watch the terminal for detailed logs showing:
- Incoming request details
- Signature verification status
- Response sent back to Slack

## Debug Tools

### 1. Event Monitor (`slack/debug/slack-event-monitor.js`)
Captures ALL incoming Slack events with detailed logging:
- Signature verification details
- Full request headers and body
- Event statistics
- Saves to `slack-events-detailed.json` for analysis

**View real-time status:**
```bash
curl http://localhost:8766/status | jq
```

### 2. Connection Tester (`slack/debug/test-slack-connection.js`)
Tests all aspects of your integration:
- Token validation
- Local server connectivity
- Public URL accessibility
- Slack API permissions
- Simulates slash commands locally

### 3. Enhanced Server Logging
The main server now logs:
- Every slash command received
- User, channel, and team details
- Signature verification results
- Response status

## Troubleshooting Checklist

### ✅ Environment Variables
Ensure these are set in `.env`:
```bash
SLACK_BOT_TOKEN=xoxb-...     # Bot User OAuth Token
SLACK_USER_TOKEN=xoxp-...    # User OAuth Token (optional)
SLACK_SIGNING_SECRET=...      # From Basic Information > App Credentials
```

### ✅ Slack App Configuration
In your Slack app settings (api.slack.com):

1. **Slash Commands** → Request URL:
   ```
   https://automation.verygoodplugins.com/slack/commands
   ```

2. **Event Subscriptions** → Request URL:
   ```
   https://automation.verygoodplugins.com/slack/events
   ```

3. **Interactivity & Shortcuts** → Request URL:
   ```
   https://automation.verygoodplugins.com/slack/interactive
   ```

### ✅ Required OAuth Scopes
Bot Token Scopes:
- `app_mentions:read`
- `channels:history`
- `chat:write`
- `commands`
- `im:history`
- `reactions:write`
- `users:read`

### ✅ Server Status Checks
```bash
# Check if main server is running
curl http://localhost:8765/health

# Check if monitor is running
curl http://localhost:8766/status

# Check if tunnel is working
curl https://automation.verygoodplugins.com/health
```

## Log Files

### Real-time Logs
Watch incoming events as they happen:
```bash
tail -f slack/debug/slack-events.log
```

### Detailed Event Analysis
View structured JSON logs:
```bash
jq . slack/debug/slack-events-detailed.json | less
```

### Filter for Errors
```bash
grep "error\|failed" slack/debug/slack-events.log
```

## Common Fixes

### Issue: "dispatch_failed" on slash commands
**Solution:** Start the server and tunnel:
```bash
bash slack/debug/start-debug.sh --with-tunnel
```

### Issue: "invalid_auth" errors
**Solution:** Regenerate your bot token in Slack app settings and update `.env`

### Issue: Signature verification failures
**Solution:** 
1. Copy signing secret from Slack app → Basic Information
2. Update `SLACK_SIGNING_SECRET` in `.env`
3. Restart the server

### Issue: Tunnel not connecting
**Solution:**
```bash
# Login to Cloudflare (if needed)
cloudflared tunnel login

# Restart tunnel
./cloudflare-tunnel/start-tunnel.sh
```

## Testing Workflow

1. **Start in debug mode:**
   ```bash
   bash slack/debug/start-debug.sh --with-tunnel
   ```

2. **Monitor logs in new terminal:**
   ```bash
   tail -f slack/debug/slack-events.log
   ```

3. **Test command in Slack:**
   ```
   /auto-jack help
   ```

4. **Check monitor status:**
   ```bash
   curl http://localhost:8766/status | jq
   ```

5. **Review captured events:**
   ```bash
   jq '.[-5:]' slack/debug/slack-events-detailed.json
   ```

## Production Setup

Once everything works in debug mode:

1. **Start normal server:**
   ```bash
   bash slack/start-slack.sh --with-tunnel
   ```

2. **Keep tunnel running permanently:**
   ```bash
   # Install as service (macOS)
   bash cloudflare-tunnel/setup-tunnel.sh
   ```

3. **Monitor health:**
   ```bash
   # Add to crontab for monitoring
   */5 * * * * curl -f http://localhost:8765/health || notify-send "Slack server down"
   ```

## Next Steps

After fixing the connection:
1. Implement async Claude processing for slash commands
2. Add database for storing command history
3. Implement delayed responses using `response_url`
4. Add interactive components (buttons, modals)
5. Create workflow step handlers

## Support

For issues not covered here:
1. Check `slack/debug/test-results.json` for detailed diagnostics
2. Review Slack API audit logs at api.slack.com
3. Enable verbose logging: `export DEBUG_MODE=true`
4. Check Cloudflare tunnel logs: `cloudflared tunnel info`