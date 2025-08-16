# Morning Support Triage

## Command
```
Perform my morning support triage:
1. Use FreeScout to list all active/pending tickets from the last 24 hours
2. For each ticket, check if the customer email exists in Stripe and get their subscription tier
3. Prioritize by: Agency ($388/yr) > Professional ($188/yr) > Plus ($147/yr) > Personal ($127/yr) > Lite > Non-customer
4. Flag any customers with failed payments in the last 7 days
5. Identify tickets mentioning specific CRMs: HighLevel, ActiveCampaign, HubSpot, Ontraport, Drip, ConvertKit, FluentCRM, Groundhogg
6. Show Agency and Professional customers first with draft responses
7. For HighLevel issues, include staging environment disclaimer
```

## Prerequisites
- FreeScout MCP (configured and working)
- Stripe MCP (for customer data)

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
- [Payment Recovery Check](./payment-recovery.md)
- [VIP Customer Care](../on-demand/customer-research.md)
- [Weekly Support Analytics](../weekly/support-analytics.md)

## Troubleshooting
- If FreeScout connection fails, check MCP is running
- If Stripe data missing, verify API key permissions
- For timeout issues, reduce time range to "last 12 hours"

## Change Log
- 2025-08-16: Initial version created
- 2025-08-16: Added HighLevel staging disclaimer
- 2025-08-16: Integrated payment failure detection
