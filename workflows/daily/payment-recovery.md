# Payment Recovery Automation

## Command
```
Run payment recovery check:
1. Search Stripe for all failed payments in the last 48 hours
2. For each failed payment, get customer details and subscription info
3. Search FreeScout for any tickets from those customer emails
4. If customer has open ticket: Flag it as "Payment Failed - Handle with Care" and draft empathetic response that addresses their support issue while gently mentioning the payment issue
5. If no open ticket but high-value customer (Professional/Agency): Create outreach list
6. Check if any failed payments are from customers who've failed before (chronic issue)
7. Generate recovery email templates based on failure reason (expired card, insufficient funds, etc.)
```

## Prerequisites
- Stripe MCP (primary data source)
- FreeScout MCP (ticket correlation)
- Gmail (optional - for sending follow-ups)

## Frequency
- Daily at 9:00 AM Berlin time
- Additional check at 3:00 PM for US customers

## Time Saved
- Manual payment review: 30 minutes
- With automation: 3 minutes
- **Saved: 27 minutes daily**

## Variables
- `LOOKBACK_PERIOD`: "48 hours"
- `HIGH_VALUE_THRESHOLD`: "$147" (Plus and above)
- `CHRONIC_THRESHOLD`: "2 failures in 30 days"

## Success Metrics
- 🎯 35% payment recovery rate within 48 hours
- 📈 $2,000+ monthly revenue saved
- 😊 Maintain positive customer relationship during recovery

## Sample Output
```
💳 PAYMENT RECOVERY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━
Failed Payments: 4 ($712 total)
With Open Tickets: 2
High-Value at Risk: 1 (Agency)

IMMEDIATE ACTION NEEDED:
------------------------
✅ Customer: tom@agency.com
   Plan: Agency ($388/year)
   Failure: Card expired
   Has Ticket: #1245 (HighLevel integration)
   Action: Flagged in FreeScout + draft ready
   
   Draft Response:
   "Hi Tom, Thanks for your patience with the HighLevel 
   integration. I've found the issue - [solution details].
   
   P.S. I noticed your card on file expired yesterday. When 
   you have a moment, you can update it at [link]. Let me 
   know if you need any assistance!"

CHRONIC FAILURES:
-----------------
⚠️ mike@example.com - 3rd failure this month
   Recommendation: Personal outreach needed
```

## Email Templates by Failure Type

### Expired Card
"Your WP Fusion subscription helps you [specific value]. Update your card in 30 seconds: [link]"

### Insufficient Funds  
"We'll retry your WP Fusion payment in 3 days. No action needed unless you'd like to update your payment method: [link]"

### Generic Decline
"There was an issue processing your WP Fusion payment. Could you check with your bank or try a different card? [link]"

## Related Workflows
- [Morning Support Triage](./morning-triage.md)
- [Churn Risk Analysis](../monthly/churn-analysis.md)
- [Revenue Report](../weekly/revenue-report.md)

## Pro Tips
- Run before morning support triage for context
- Agency/Professional failures get founder-level attention
- Track recovery rates to optimize messaging

## Change Log
- 2025-08-16: Created initial version
- 2025-08-16: Added chronic failure detection
- 2025-08-16: Integrated FreeScout ticket flagging
