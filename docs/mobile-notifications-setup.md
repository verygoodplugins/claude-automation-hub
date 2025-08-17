# Mobile Notifications Setup Guide

## Quick Setup (5 minutes)

### 1. Install ntfy Mobile App
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=io.heckel.ntfy)
- **iOS**: [App Store](https://apps.apple.com/us/app/ntfy/id1625396347)

### 2. Create Your Unique Topic
Choose a topic name that's hard to guess:
```
claude-automation-alerts-[your-initials]-[random-numbers]
Example: claude-automation-alerts-jg-x7y9z
```

### 3. Subscribe in Mobile App
1. Open ntfy app
2. Tap "+" to add subscription
3. Enter your topic name
4. Tap "Subscribe"

### 4. Set Environment Variable
Add to your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
export NTFY_TOPIC="your-topic-name-here"
```
Then reload: `source ~/.zshrc`

### 5. Test Your Setup
Run this command in Claude:
```
Use the send_notification tool to send a test message: "Mobile notifications are working! 🎉"
```

You should receive a push notification on your phone!

## Advanced Configuration

### Custom Topics for Different Workflows
```bash
# Different topics for different purposes
export NTFY_TOPIC_DAILY="claude-daily-jg-123"      # Daily workflows
export NTFY_TOPIC_URGENT="claude-urgent-jg-456"    # Critical alerts
export NTFY_TOPIC_WORK="claude-work-jg-789"        # Work-related only
```

### Priority Levels
- `urgent`: Red notification with alarm sound
- `high`: Yellow with notification sound
- `default`: Normal notification
- `low`: No sound, minimal priority
- `min`: Silent, background only

### Notification Icons & Tags
Common tag combinations:
- `complete,white_check_mark`: ✅ Workflow complete
- `error,warning`: ⚠️ Something went wrong  
- `progress,hourglass`: ⏳ Work in progress
- `reminder,bell`: 🔔 Time-based reminder

## Integration Examples

### Morning Routine with Notifications
```markdown
1. NOTIFY: "🌅 Starting morning routine..."
2. Check calendar for today's meetings
3. Review overnight emails and prioritize
4. Set up focus environment (Spotify, browser tabs)
5. NOTIFY: "☀️ Morning setup complete! Ready for the day."
```

### Meeting Prep with Progress Updates
```markdown
1. NOTIFY: "📋 Preparing for 2:00 PM client meeting..."
2. Gather meeting context from Gmail and Calendar
3. NOTIFY: "📄 Context gathered, reviewing previous discussions..."
4. Check FreeScout for any customer issues
5. Create agenda and talking points
6. NOTIFY: "✅ Meeting prep complete! Agenda ready."
```

### Long-Running Workflows
For workflows that take 5+ minutes:
```javascript
// Start notification
await send_notification({
  message: "🔍 Starting comprehensive weekly review...",
  title: "Weekly Planning",
  priority: "low"
});

// Progress updates every few steps
await send_notification({
  message: "Step 3/8: Analyzing time tracking data...",
  priority: "min",
  tags: ["progress"]
});

// Completion with summary
await send_notification({
  message: "📊 Weekly review complete!\n\n• Goals achieved: 4/5\n• Top priority for next week: Product launch\n• Time optimization found: 2.5 hours",
  title: "Weekly Review Done",
  priority: "default",
  tags: ["complete", "weekly"]
});
```

## Security & Privacy

### Topic Naming Best Practices
❌ **Bad**: `claude`, `notifications`, `my-alerts`
✅ **Good**: `claude-automation-jg-x7y9z`, `work-alerts-2024-abc123`

### What NOT to Include in Notifications
- API keys or passwords
- Customer personal information
- Sensitive business data
- Full email contents

### What's Safe to Include
- Workflow completion status
- High-level summaries ("3 emails processed")
- Time saved metrics
- Next action reminders
- Error types (without sensitive details)

## Troubleshooting

### "Notification not sent" Errors

1. **Check environment variable**:
   ```bash
   echo $NTFY_TOPIC
   # Should show your topic name
   ```

2. **Test manual notification**:
   ```bash
   curl -d "Manual test" ntfy.sh/$NTFY_TOPIC
   ```

3. **Verify topic subscription**:
   - Open ntfy app
   - Check you're subscribed to the exact topic name
   - Topic names are case-sensitive!

### Notifications Not Appearing on Phone

1. **Check app permissions**:
   - iOS: Settings → Notifications → ntfy → Allow Notifications
   - Android: App settings → Notifications → Enable

2. **Test with high priority**:
   ```javascript
   await send_notification({
     message: "High priority test",
     priority: "urgent"
   });
   ```

3. **Check Do Not Disturb**:
   - Ensure phone isn't in silent/DND mode
   - ntfy notifications respect system settings

### Common Environment Issues

**macOS/Linux**:
```bash
# Add to ~/.zshrc (zsh) or ~/.bashrc (bash)
export NTFY_TOPIC="your-topic-here"

# Reload shell
source ~/.zshrc  # or source ~/.bashrc
```

**Check if variable persists**:
```bash
# Should work in new terminal windows
echo $NTFY_TOPIC
```

## Self-Hosted Option (Advanced)

For sensitive workflows, consider hosting your own ntfy server:

```bash
# Docker setup
docker run -d \\
  --name ntfy \\
  -p 80:80 \\
  -v /var/cache/ntfy:/var/cache/ntfy \\
  binwiederhier/ntfy serve
```

Then update notification tool to use your server:
```javascript
const ntfyUrl = `https://your-server.com/${ntfyTopic}`;
```

## Usage Patterns

### 1. "Set and Forget" Workflows
Start long automation, get notification when complete:
- Weekly reviews (20+ minutes)
- Data analysis workflows
- Backup and maintenance tasks

### 2. "Progress Tracking" Workflows  
Multi-step workflows with progress updates:
- Morning/evening routines
- Project setup automation
- Customer onboarding workflows

### 3. "Error Monitoring" Workflows
Get alerted when automations need attention:
- API failures
- Missing permissions
- Timeout issues

### 4. "Scheduled Reminders"
Time-based notifications for workflow triggers:
- "Time for afternoon review"
- "Deep work block starting in 10 minutes"
- "End of day shutdown at 5:30 PM"

## Integration with Other Systems

### Combine with Calendar
```javascript
// Schedule notification for workflow trigger
await send_notification({
  message: "⏰ Scheduled: End-of-day shutdown starting in 15 minutes",
  priority: "low",
  tags: ["reminder", "schedule"]
});
```

### Combine with Slack/WhatsApp
```javascript
// Notify both team AND yourself
await send_whatsapp_message(teamChat, "EOD automation complete");
await send_notification({
  message: "✅ Team notified of EOD completion",
  tags: ["complete", "team"]
});
```

## Next Steps

1. **Test basic setup** with simple notifications
2. **Add to existing workflows** starting with end-of-day shutdown
3. **Experiment with priorities** and tags for different workflow types
4. **Create custom topics** for different areas (work, personal, urgent)
5. **Share successful patterns** with the automation hub community

---

**🎯 Goal**: Never wait for an automation to complete again. Start workflows and get notified when they're done!
