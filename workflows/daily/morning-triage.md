# Morning Support Triage

## Command
```
Perform my morning support triage:
1. Use FreeScout to search for all active/pending tickets from the last 24 hours
2. For high-priority tickets, use freescout_analyze_ticket to determine root cause
3. Check my Gmail for any urgent support emails not in FreeScout
4. Create draft replies using freescout_create_draft_reply for complex issues
5. Add internal notes using freescout_add_note for team visibility
6. For recurring issues, check MCP Memory Service for previous solutions
7. Update Apple Reminders with follow-up tasks for unresolved tickets
```

## Prerequisites
- FreeScout MCP (configured and working)
- Gmail MCP (for email backup check)
- Apple Reminders MCP (for task management)
- MCP Memory Service MCP (for solution history)

## Frequency
Daily at 8:30 AM Berlin time (before deep work block)

## Time Saved
- Manual triage: 45 minutes
- With automation: 5 minutes
- **Saved: 40 minutes daily**

## Variables You Can Customize
- `TIME_RANGE`: "last 24 hours" 
- `PRIORITY_TIERS`: ["Agency", "Professional"]
- `CRM_WATCH_LIST`: ["HighLevel", "ActiveCampaign", "HubSpot"]
- `PAYMENT_LOOKBACK`: "7 days"

## Success Metrics
- ✅ All tickets reviewed
- ✅ High-value customers identified
- ✅ Payment issues flagged
- ✅ CRM-specific issues categorized
- ✅ Draft responses prepared

## Sample Output Format
```
🎯 PRIORITY CUSTOMERS (Agency/Professional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ticket #1234 - John Smith (Agency - $388/yr)
Issue: HighLevel webhook not firing
Draft: [Personalized response with staging test steps]
⚠️ Note: Customer since 2021, lifetime value $1,164

Ticket #1235 - Sarah Jones (Professional - $188/yr) 
Issue: User meta not syncing to ActiveCampaign
Draft: [Response with code snippet for functions.php]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STANDARD SUPPORT QUEUE
[Rest of tickets listed by priority]

🚨 PAYMENT ISSUES
- mike@example.com - Failed payment 3 days ago, has open ticket #1236
```

## Related Workflows
- [Customer Communication Hub](../on-demand/customer-communication-hub.md)
- [FreeScout Implementation](../on-demand/freescout-implementation.md)
- [Weekly Review](../weekly/review-planning.md)

## Troubleshooting
- If FreeScout connection fails, check MCP is running
- If Stripe data missing, verify API key permissions
- For timeout issues, reduce time range to "last 12 hours"

## Change Log
- 2025-08-16: Initial version created
- 2025-08-16: Added HighLevel staging disclaimer
- 2025-08-16: Integrated payment failure detection
