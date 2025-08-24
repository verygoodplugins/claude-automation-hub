# Focus Mode Activation

## Command
```
Activate my deep focus mode for maximum productivity:
1. Set Spotify to play "Deep Focus" playlist at 25% volume
2. Use Brave browser to close all tabs except current work
3. Create a "Focus Session" in Apple Reminders with subtasks
4. Send WhatsApp message to team: "In deep focus until [time], will respond after"
5. Check Google Calendar for next 2 hours and decline non-urgent meetings
6. Block distracting websites using Brave (social media, news)
7. Set up filesystem watcher for project files to track changes
8. Store focus session start time in MCP Memory Service for productivity tracking
9. Create a post-focus checklist in Apple Reminders
```

## Prerequisites
- Spotify MCP (for focus music)
- Brave Browser MCP (for distraction blocking)
- Apple Reminders MCP (for session tracking)
- WhatsApp MCP (for status updates)
- Google Calendar MCP (for meeting management)
- Filesystem MCP (for project monitoring)
- MCP Memory Service MCP (for productivity tracking)

## Frequency
On-demand (2-3 times daily during deep work blocks)

## Time Saved
- Manual setup: 10 minutes
- With automation: 30 seconds
- **Saved: 9.5 minutes per session**

## Variables You Can Customize
- `FOCUS_DURATION`: 90 // minutes
- `SPOTIFY_PLAYLIST`: "Deep Focus"
- `VOLUME_LEVEL`: 25
- `BLOCKED_SITES`: ["twitter.com", "youtube.com", "reddit.com", "news.ycombinator.com"]
- `ALLOWED_TABS`: ["github.com", "localhost", "documentation"]
- `AUTO_DECLINE_MEETINGS`: true
- `TEAM_NOTIFICATION`: true

## Success Metrics
- ✅ Distractions eliminated
- ✅ Team notified
- ✅ Calendar protected
- ✅ Environment optimized
- ✅ Progress tracked

## Sample Output Format
```
🎯 FOCUS MODE ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ SESSION DETAILS
• Duration: 90 minutes
• End time: 11:30 AM
• Mode: Deep Work
• Project: API Refactoring

🎵 AUDIO ENVIRONMENT
✅ Spotify: "Deep Focus" playlist started
✅ Volume set to 25%
✅ Track: "Alpha Waves for Concentration"

🌐 BROWSER OPTIMIZATION
✅ Closed 14 distracting tabs
✅ Kept 3 work tabs:
  - GitHub: current-project
  - Localhost:3000
  - MDN Documentation
✅ Blocked sites (8):
  - twitter.com
  - youtube.com
  - reddit.com
  - news.ycombinator.com
  - facebook.com
  - instagram.com
  - linkedin.com
  - slack.com (web)

📅 CALENDAR PROTECTION
• Next 90 minutes: BLOCKED
• Declined meetings (1):
  - "Quick sync" at 10:30 (marked tentative)
• Protected time until: 11:30 AM

💬 TEAM NOTIFIED
✅ WhatsApp status sent to 3 groups:
  "🎯 In deep focus until 11:30 AM. Will respond after.
   Working on: API Refactoring"

✅ FOCUS CHECKLIST CREATED
Current Session Tasks:
□ Complete authentication module
□ Write unit tests for API endpoints
□ Update documentation
□ Review error handling
□ Commit changes with clear message

📁 FILE MONITORING ACTIVE
Watching: ~/Projects/api-refactor/
• Will track all changes for session summary

💾 SESSION TRACKING
• Start time recorded: 10:00 AM
• Previous best focus: 87 minutes
• Weekly focus time: 12.5 hours

🔔 POST-FOCUS REMINDERS SET
At 11:30 AM:
1. Take 10-minute break
2. Check team messages
3. Review completed tasks
4. Respond to declined meeting
5. Update project status

⚡ QUICK ACTIONS AVAILABLE
• Say "Extend focus" to add 30 minutes
• Say "Emergency break" to end early
• Say "Status update" to notify team of progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧘 Your space is ready. Deep work begins now.
```

## Post-Session Summary (Automatic)
```
📊 FOCUS SESSION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ ACTUAL DURATION: 92 minutes (2 min over!)

✅ COMPLETED TASKS (4/5)
• ✅ Authentication module complete
• ✅ Unit tests written (12 new tests)
• ✅ Documentation updated
• ✅ Error handling reviewed
• ⏸️ Commit pending (staged changes)

📁 FILES MODIFIED
• 8 files changed
• 247 lines added
• 43 lines removed
• 3 new files created

🎯 PRODUCTIVITY SCORE: 94/100
• No distractions detected
• Consistent activity throughout
• Goals 80% achieved

💭 REFLECTION PROMPT
What was your biggest win this session?
(Response saved to memory for pattern analysis)
```

## Related Workflows
- [Pomodoro Timer](./pomodoro-setup.md)
- [End of Day Shutdown](../daily/evening-shutdown.md)
- [Meeting-Free Block](./meeting-free.md)

## Troubleshooting
- Spotify may need to be running before activation
- Browser tab closing requires Brave to be active window
- Calendar blocking works best with single calendar
- Some sites may need manual unblocking after session
