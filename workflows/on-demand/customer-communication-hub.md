# Customer Communication Hub

## Command
```
Create a comprehensive customer communication report:
1. Search WhatsApp for all customer conversations from the past week
2. Search Gmail for customer emails with keywords: "issue", "problem", "help", "urgent"
3. Get all FreeScout tickets with customer messages
4. Analyze sentiment and identify recurring themes
5. For VIP customers, create personalized follow-up drafts
6. Schedule follow-up reminders in Apple Reminders
7. Store communication patterns in OpenMemory for trend analysis
8. Generate a summary report with actionable insights
```

## Prerequisites
- WhatsApp MCP (for message history)
- Gmail MCP (for email search)
- FreeScout MCP (for support tickets)
- Apple Reminders MCP (for follow-ups)
- OpenMemory MCP (for pattern storage)

## Frequency
On-demand (typically weekly or before customer success meetings)

## Time Saved
- Manual analysis: 2 hours
- With automation: 10 minutes
- **Saved: 110 minutes per run**

## Variables You Can Customize
- `LOOKBACK_PERIOD`: "7 days"
- `VIP_CUSTOMERS`: ["customer1@example.com", "customer2@example.com"]
- `SENTIMENT_KEYWORDS`: {
    "positive": ["thank you", "great", "awesome", "perfect"],
    "negative": ["issue", "problem", "broken", "frustrated"],
    "urgent": ["asap", "urgent", "immediately", "critical"]
  }
- `FOLLOW_UP_DAYS`: 3

## Success Metrics
- ✅ All communication channels analyzed
- ✅ Sentiment patterns identified
- ✅ VIP customers prioritized
- ✅ Follow-ups scheduled
- ✅ Trends documented

## Sample Output Format
```
📊 CUSTOMER COMMUNICATION ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 OVERVIEW
• Total conversations: 47
• Active customers: 23
• Response rate: 94%
• Avg response time: 2.3 hours

😊 SENTIMENT ANALYSIS
• Positive: 68% (↑ 5% from last week)
• Neutral: 24%
• Negative: 8% (↓ 2% from last week)

🔥 HOT TOPICS
1. Integration questions (12 mentions)
2. Feature requests - API access (8 mentions)
3. Billing inquiries (5 mentions)

⭐ VIP CUSTOMER STATUS
• John Doe (Enterprise): Last contact 2 days ago - Happy
  Draft: "Hi John, checking in on your API implementation..."
  
• Sarah Smith (Agency): Reported issue yesterday - In progress
  Draft: "Hi Sarah, our team has identified the webhook issue..."

🔄 RECURRING THEMES
• Documentation gaps for WebSocket implementation
• Confusion about pricing tiers
• Request for video tutorials

📅 FOLLOW-UPS SCHEDULED
• 3 customers need follow-up within 48 hours
• 5 feature request responses pending
• 2 billing clarifications needed

💡 RECOMMENDATIONS
1. Create WebSocket documentation FAQ
2. Clarify pricing page with comparison table
3. Schedule video tutorial recording session
4. Implement automated response for common questions

📊 WEEK-OVER-WEEK TRENDS
• Support volume: -15% (good!)
• Resolution time: -30% (improved!)
• Customer satisfaction: +8%
```

## Related Workflows
- [VIP Customer Check-in](./vip-checkin.md)
- [Support Analytics](../weekly/support-analytics.md)
- [Feature Request Tracking](../on-demand/feature-tracking.md)

## Troubleshooting
- For WhatsApp sync issues, ensure desktop app is connected
- Gmail search may need scope permissions updated
- Large data sets may require pagination
