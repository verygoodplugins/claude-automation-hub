# Meeting Preparation Assistant

## Command
```
Prepare me for my upcoming meeting:
1. Get meeting details from Google Calendar (attendees, agenda, location/link)
2. Search Gmail for recent conversations with attendees
3. Check OpenMemory for previous meeting notes and action items
4. Search FreeScout for any support tickets from attendee companies
5. Look up attendee information via WhatsApp conversations
6. Use Context7 to get relevant technical documentation if needed
7. Create meeting agenda outline with talking points
8. Generate pre-meeting checklist in Apple Reminders
9. Set reminder 10 minutes before meeting
10. Open relevant browser tabs and documents
```

## Prerequisites
- Google Calendar MCP (for meeting details)
- Gmail MCP (for email context)
- OpenMemory MCP (for historical notes)
- FreeScout MCP (for support context)
- WhatsApp MCP (for additional context)
- Context7 MCP (for technical docs)
- Apple Reminders MCP (for checklists)
- Brave Browser MCP (for resources)
- Filesystem MCP (for documents)

## Frequency
On-demand (typically 30-60 minutes before important meetings)

## Time Saved
- Manual preparation: 35 minutes
- With automation: 5 minutes
- **Saved: 30 minutes per meeting**

## Variables You Can Customize
- `MEETING_ID`: "calendar_event_id" or "next"
- `LOOKBACK_DAYS`: 30 // for email/message history
- `PREP_TIME`: 10 // minutes before meeting for reminder
- `INCLUDE_SUPPORT_HISTORY`: true
- `OPEN_RESOURCES`: true
- `TECHNICAL_DOCS`: ["API", "Integration", "SDK"]
- `ATTENDEE_RESEARCH_DEPTH`: "comprehensive" | "basic"

## Success Metrics
- ✅ All context gathered
- ✅ Talking points prepared
- ✅ Previous commitments identified
- ✅ Resources ready
- ✅ Confident and prepared

## Sample Output Format
```
📅 MEETING PREPARATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 MEETING DETAILS
• Title: Q4 Product Planning Session
• Time: Today at 2:00 PM (in 47 minutes)
• Duration: 60 minutes
• Location: Zoom (link ready in browser)
• Attendees: 4 people
  - Sarah Chen (Product Lead)
  - Michael Torres (CTO)
  - Jennifer Park (Customer Success)
  - You (Engineering Lead)

👥 ATTENDEE CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━

Sarah Chen - Product Lead
• Last email: 2 days ago re: feature priorities
• Key topics: API v3, mobile app, enterprise features
• Previous commitment: Review technical feasibility
• Support tickets: None
• Relationship: 8 meetings in past 3 months

Michael Torres - CTO
• Last email: Yesterday re: architecture decisions
• Key concern: Scalability for enterprise
• Previous commitment: Performance benchmarks
• Recent WhatsApp: Discussed Redis implementation
• Decision maker for: Technical stack, timeline

Jennifer Park - Customer Success
• Last email: This morning re: customer feedback
• Key input: 3 enterprise deals pending features
• Support context: 5 escalated tickets this month
• Pain points: Integration complexity, documentation

📝 PREVIOUS MEETING NOTES (Oct 3)
• Decided: Prioritize API v3 over mobile
• Action items:
  ✅ Complete technical assessment (DONE)
  ⏳ Benchmark current performance (70% done)
  ❌ Create migration guide (pending)
• Follow-up needed: Timeline confirmation

📊 RELEVANT DATA GATHERED
• Support tickets mentioning API: 12 this month
• Customer requests for mobile: 8 companies
• Enterprise pipeline: $240K dependent on Q4 delivery
• Team capacity: 3 engineers available

💬 KEY TALKING POINTS
━━━━━━━━━━━━━━━━━━━━━━━━

1. **API v3 Status Update**
   - Development 60% complete
   - Blocker: Authentication redesign
   - Proposal: 2-week sprint to resolve

2. **Mobile App Feasibility**
   - Resource requirement: 2 engineers × 3 months
   - Alternative: Progressive Web App (1 month)
   - Customer impact: 8 requesting, 3 critical

3. **Enterprise Features**
   - SSO implementation: 3 weeks
   - Audit logs: 1 week
   - ROI: $240K in Q4 pipeline

4. **Technical Debt Discussion**
   - Redis migration improves performance 3x
   - Refactoring auth prevents future issues
   - Testing coverage needs boost to 80%

❓ QUESTIONS TO ASK
1. What's the drop-dead date for enterprise features?
2. Can we delay mobile for Progressive Web App?
3. Is additional headcount approved for Q4?
4. What's the priority: new features vs. stability?

📚 DOCUMENTATION PREPARED
• API v3 Migration Guide (Context7)
• Performance Benchmarks (local file)
• Customer Feedback Summary (from Jennifer)
• Technical Roadmap Draft (Google Doc)

✅ PRE-MEETING CHECKLIST
□ Review agenda (5 min)
□ Test Zoom audio/video
□ Close distracting tabs
□ Prepare notebook for notes
□ Review previous commitments
□ Deep breath, you're ready!

🔔 REMINDERS SET
• 1:50 PM: 10-minute warning
• 1:55 PM: Join meeting room
• 1:58 PM: Final prep check

🌐 BROWSER TABS OPENED
1. Zoom meeting room
2. Shared agenda document
3. API documentation
4. Performance dashboard
5. Customer feedback sheet
6. Previous meeting notes

📂 FILES READY
• /Desktop/q4-roadmap-draft.pdf
• /Documents/api-benchmarks.xlsx
• /Projects/migration-guide.md

💡 STRATEGIC RECOMMENDATIONS
• Lead with customer impact data
• Propose Progressive Web App as compromise
• Emphasize enterprise revenue opportunity
• Request additional resources for Q4 push

━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Quick Actions Available:
• Say "Email agenda to attendees"
• Say "Create follow-up template"
• Say "Start meeting notes document"

🎯 You're fully prepared. Go make it happen!
```

## Related Workflows
- [Calendar Analysis](../weekly/calendar-optimization.md)
- [Customer Research](../on-demand/customer-communication-hub.md)
- [Follow-up Automation](./meeting-followup.md)

## Troubleshooting
- For external attendees, email search may be limited
- Large email threads may need summarization
- Calendar permissions required for full details
- Some technical docs may require manual search
