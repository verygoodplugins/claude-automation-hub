# Tax Compliance Package Generator

## Command
```
Generate my quarterly tax compliance package:
1. Pull all payment processor revenue for the quarter, separated by country/region
2. Calculate gross revenue, refunds, net revenue, and processing fees
3. Search email for all receipts and expense invoices, categorize them:
   - Conference and business travel (deductible)
   - Software subscriptions (deductible)
   - Infrastructure/hosting costs (COGS)
   - Team/contractor payments
4. Check calendar for business travel dates and pull related expenses
5. Generate multi-jurisdiction reports:
   - International report: Revenue and expenses by region
   - Domestic report: Income and deductions breakdown
6. List any missing documentation needed
7. Create reminders for upcoming payment deadlines
```

## Prerequisites
- Stripe MCP (revenue data)
- Gmail (expense receipts)
- Google Calendar (business travel)
- Filesystem (save reports locally)

## Frequency
- Quarterly: March 15, June 15, September 15, December 15
- Monthly mini-check on the 1st

## Time Saved
- Manual compilation: 8-10 hours
- With automation: 30 minutes
- **Saved: 9+ hours quarterly (36 hours/year)**

## Variables
- `QUARTER`: "Q2 2025"
- `PRIMARY_TAX_RATE`: 0.30 (adjust to your jurisdiction)
- `SECONDARY_TAX_RATE`: 0.25 (adjust to your jurisdiction)
- `EXCHANGE_RATE`: "current market rate"

## Success Metrics
- ✅ All revenue categorized by jurisdiction
- ✅ All expenses documented with receipts
- ✅ Travel dates matched to expenses
- ✅ Both country reports generated
- ✅ Payment reminders set

## Sample Output
```
📊 [QUARTER] [YEAR] TAX COMPLIANCE PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 REVENUE SUMMARY
Total Gross: $[TOTAL_GROSS]
- US Customers: $[US_REVENUE] ([US_PERCENT]%)
- EU Customers: €[EU_REVENUE] ($[EU_USD])
- Rest of World: $[ROW_REVENUE]

Refunds: $[REFUNDS]
Processing Fees: $[FEES]
NET REVENUE: $[NET_REVENUE]

📝 EU TAX REPORT
━━━━━━━━━━━━━━━━━━━━━━━
Revenue: €[EU_TOTAL]
Deductible Expenses:
- Software/Tools: €[SOFTWARE]
- Marketing: €[MARKETING]
- Conference Travel: €[CONFERENCES]
- Hosting/Infrastructure: €[HOSTING]
- Contractors: €[CONTRACTORS]

Net Income: €[NET_INCOME]
Estimated Tax ([TAX_RATE]%): €[TAX_DUE]
Due Date: [DUE_DATE]

📝 US TAX REPORT (LLC)
━━━━━━━━━━━━━━━━━━━━━━━━
Revenue: $[US_REVENUE]
Deductible Expenses:
- Software/SaaS: $[SOFTWARE_US]
- Cloud Services: $[CLOUD]
- Travel (conferences): $[TRAVEL]
- Marketing/Ads: $[MARKETING_US]
- Professional Services: $[SERVICES]

Net Income: $[US_NET]
Estimated Tax ([US_TAX_RATE]%): $[US_TAX]
Quarterly Payment Due: [US_DUE_DATE]

🗂️ EXPENSE DOCUMENTATION
Found: [RECEIPTS_FOUND] receipts
Categorized: [RECEIPTS_CATEGORIZED]
Missing: [RECEIPTS_MISSING]
[LIST_OF_MISSING_RECEIPTS]

✈️ BUSINESS TRAVEL
[TRAVEL_DETAILS]

⚠️ ACTION ITEMS
[ACTION_LIST]

📅 UPCOMING DEADLINES
[DEADLINE_LIST]

💡 TAX OPTIMIZATION NOTES
- Conference travel is fully deductible
- Consider max retirement contribution
- R&D activities might qualify for credits
- Review LLC/corporate tax requirements
```

## Document Storage
Reports are saved to:
- `~/Documents/Taxes/[YEAR]/[QUARTER]/`
- Backed up to cloud storage

## Related Workflows
- [Monthly Revenue Analysis](./revenue-analysis.md)
- [Expense Tracking](../daily/expense-tracker.md)
- [Annual Tax Planning](./annual-tax-plan.md)

## Important Notes
- Always verify exchange rates for accurate conversion
- Keep appropriate percentage of revenue aside for taxes (varies by jurisdiction)
- Check local tax payment deadlines
- Quarterly estimated payments may be required in many jurisdictions

## Change Log
- 2025-08-16: Created comprehensive dual-country version
- 2025-08-16: Added automatic receipt categorization
- 2025-08-16: Integrated travel expense matching
