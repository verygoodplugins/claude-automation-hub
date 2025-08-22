# Complete Morning Routine

## Command
```
Execute my complete morning routine:
1. Check today's Google Calendar events and find free time blocks
2. List all Gmail messages from the last 12 hours, prioritize by sender importance
3. Check WhatsApp messages from key contacts and groups
4. Review Apple Reminders due today and overdue items
5. Play my "Morning Focus" playlist on Spotify at 30% volume
6. Open Brave browser to my dashboard tabs (analytics, support, calendar)
7. Check filesystem for any new files in ~/Downloads that need processing
8. Store today's priorities in OpenMemory for evening review
```

## Prerequisites
- Google Calendar MCP (for schedule)
- Gmail MCP (for emails)
- WhatsApp MCP (for messages)
- Apple Reminders MCP (for tasks)
- Spotify MCP (for music)
- Brave Browser MCP (for web automation)
- Filesystem MCP (for file management)
- OpenMemory MCP (for persistent storage)

## Frequency
Daily at 7:00 AM Berlin time

## Time Saved
- Manual routine: 30 minutes
- With automation: 3 minutes
- **Saved: 27 minutes daily**

## Variables You Can Customize
- `EMAIL_LOOKBACK`: "12 hours"
- `SPOTIFY_PLAYLIST`: "Morning Focus"
- `VOLUME_LEVEL`: 30
- `DASHBOARD_URLS`: ["analytics.example.com", "freescout.example.com"]
- `DOWNLOAD_CHECK_PATH`: "~/Downloads"

## Success Metrics
- ✅ Calendar reviewed and free time identified
- ✅ Emails triaged by priority
- ✅ Messages checked
- ✅ Tasks organized
- ✅ Environment set up for productivity

## Sample Output Format
```
🌅 MORNING ROUTINE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 TODAY'S SCHEDULE
• 9:00-10:00: Team standup
• 10:00-12:00: FREE - Deep work block available
• 14:00-15:00: Client call
• 15:00-17:00: FREE - Project time available

📧 PRIORITY EMAILS (3 requiring response)
1. CEO - Re: Q4 Planning (urgent)
2. Client - Integration question
3. Team lead - Code review needed

💬 WHATSAPP UPDATES
• Dev Team (2 new): Deployment complete ✅
• Support Group (5 new): Issues resolved
• John Doe: "Can we sync at 3pm?"

✅ TODAY'S TASKS (5 items)
1. 🔴 Review PR #234 (overdue)
2. 🟡 Prepare client presentation
3. 🟢 Update documentation
4. 🟢 Team 1:1 prep
5. 🟢 Email newsletter draft

🎵 Spotify: Playing "Morning Focus" at 30% volume

🌐 Browser: Opened 3 dashboard tabs

📁 Downloads: 2 new files require attention
• invoice_2025.pdf
• client_feedback.docx

💾 Priorities saved to memory for evening review
```

## Related Workflows
- [End of Day Shutdown](./end-of-day-shutdown.md)
- [Focus Mode Setup](../on-demand/focus-mode.md)
- [Weekly Review](../weekly/review-planning.md)

## Troubleshooting
- If Spotify doesn't play, check if app is running
- For calendar sync issues, refresh Google auth
- WhatsApp requires desktop app to be logged in
