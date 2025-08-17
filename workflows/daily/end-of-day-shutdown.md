# End of Day Shutdown

## Command
```
Execute my complete end of day shutdown routine:
1. Save all open work and progress notes to OpenMemory with today's date
2. Check Gmail for any urgent messages that need flagging for tomorrow
3. Review today's completed tasks in Apple Reminders and archive them
4. Create tomorrow's priority list based on calendar and pending tasks
5. Send end-of-day status update via WhatsApp to team/accountability partner
6. Use Brave to bookmark important tabs and close all browser windows
7. Clean up Downloads folder by organizing files into proper directories
8. Set up calendar blocks for tomorrow's deep work sessions
9. Create evening reminder for personal time activities
10. Play "Wind Down" playlist on Spotify at low volume
```

## Prerequisites
- OpenMemory MCP (for work state storage)
- Gmail MCP (for email check)
- Apple Reminders MCP (for task management)
- Google Calendar MCP (for tomorrow's planning)
- WhatsApp MCP (for status updates)
- Brave Browser MCP (for browser cleanup)
- Filesystem MCP (for file organization)
- Spotify MCP (for ambiance)

## Frequency
Daily at 5:30 PM Berlin time (or end of workday)

## Time Saved
- Manual shutdown: 25 minutes
- With automation: 3 minutes
- **Saved: 22 minutes daily**

## Variables You Can Customize
- `SHUTDOWN_TIME`: "17:30"
- `STATUS_RECIPIENTS`: ["team-chat", "accountability-partner"]
- `TOMORROW_PRIORITIES`: 3 // number of top priorities
- `DOWNLOADS_CLEANUP`: true
- `ARCHIVE_COMPLETED`: true
- `EVENING_PLAYLIST`: "Wind Down"
- `DEEP_WORK_BLOCKS`: 2 // for tomorrow

## Success Metrics
- ✅ Work progress saved
- ✅ Inbox checked and triaged
- ✅ Tasks reviewed and archived
- ✅ Tomorrow planned
- ✅ Team updated
- ✅ Workspace cleaned
- ✅ Mind ready to disconnect

## Sample Output Format
```
🌅 END OF DAY SHUTDOWN COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 WORK SAVED TO MEMORY
• Project: API Refactoring - 70% complete
• Key decisions: Chose REST over GraphQL
• Blockers: Need review on auth module
• Tomorrow focus: Complete testing suite
• Time spent: 4.5 hours productive time

📧 EMAIL STATUS
• Urgent for tomorrow: 2 messages flagged
  - Client: Integration question (respond by 10am)
  - Team lead: Code review request
• Total processed today: 34 emails
• Response rate: 91%

✅ TODAY'S ACCOMPLISHMENTS
Completed (8/10 tasks):
• ✅ API endpoint implementation
• ✅ Team standup
• ✅ Client call
• ✅ Documentation update
• ✅ PR reviews (3)
• ✅ Bug fix for issue #234
• ✅ Weekly report draft
• ✅ 1:1 with junior dev
• ⏸️ Blog post (moved to tomorrow)
• ❌ Video recording (rescheduled)

📅 TOMORROW'S SETUP
Top 3 Priorities:
1. 🔴 Complete testing suite for API
2. 🟡 Respond to client integration question
3. 🟢 Record product demo video

Deep Work Blocks Reserved:
• 9:00-11:00 AM: API testing
• 2:00-4:00 PM: Video recording

🗓️ Calendar Protected:
• Total focus time: 4 hours
• Meetings scheduled: 3
• Buffer time: 1 hour

💬 TEAM STATUS SENT
WhatsApp to Dev Team:
"EOD Update: API refactoring 70% done. Testing 
tomorrow AM. Blocker: need auth module review.
Available async until 7pm if urgent. 🚀"

🌐 BROWSER CLEANUP
• Important tabs bookmarked: 4
  - API documentation
  - Client requirements
  - Testing framework guide
  - Stack Overflow solution
• Tabs closed: 23
• Memory freed: ~2GB

📁 DOWNLOADS ORGANIZED
• Files processed: 7
  → 3 PDFs moved to /Documents/References/
  → 2 images moved to /Projects/Assets/
  → 1 video moved to /Resources/Tutorials/
  → 1 zip archived to /Archives/
• Downloads folder: Clean ✨

🔔 EVENING REMINDERS SET
• 6:30 PM: Gym workout
• 8:00 PM: Call parents
• 9:30 PM: Read for 30 minutes
• 10:30 PM: Bedtime routine

🎵 Spotify: "Wind Down" playlist started

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💭 Reflection Prompt: What was today's biggest win?
(Saved to memory for weekly review)

🏁 Workday Complete. Time to recharge!
```

## Related Workflows
- [Morning Routine](./morning-routine.md)
- [Weekly Review](../weekly/review-planning.md)
- [Focus Mode](../on-demand/focus-mode.md)

## Troubleshooting
- If browser tabs don't close, ensure Brave is the active window
- WhatsApp requires desktop app to be connected
- Large Downloads folders may need multiple cleanup passes
- Calendar blocking requires write permissions
