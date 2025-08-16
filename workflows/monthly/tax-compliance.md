# Tax Compliance Package Generator

## Command
```
Generate my quarterly tax compliance package:
1. Pull all Stripe revenue for the quarter, separated by country (US vs Germany vs other)
2. Calculate gross revenue, refunds, net revenue, and processing fees
3. Search Gmail for all receipts and expense invoices, categorize them:
   - WordPress conference travel (deductible)
   - Software subscriptions (deductible)
   - Cloudflare/hosting costs (COGS)
   - Team/contractor payments
4. Check calendar for business travel dates and pull related expenses
5. Generate two reports:
   - German report: Revenue in EUR, expenses categorized for GewSt
   - US report: Delaware LLC income, federal/state breakdown
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
- `GERMAN_TAX_RATE`: 0.35 (combined)
- `US_TAX_RATE`: 0.28 (federal + state)
- `EXCHANGE_RATE`: "EUR/USD current"

## Success Metrics
- ✅ All revenue categorized by jurisdiction
- ✅ All expenses documented with receipts
- ✅ Travel dates matched to expenses
- ✅ Both country reports generated
- ✅ Payment reminders set

## Sample Output
```
📊 Q2 2025 TAX COMPLIANCE PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 REVENUE SUMMARY
Total Gross: $51,247
- US Customers: $31,450 (61%)
- German Customers: €8,234 ($8,897)
- Other EU: €4,123 ($4,453)
- Rest of World: $6,447

Refunds: $1,243
Processing Fees: $1,487
NET REVENUE: $48,517

📝 GERMAN TAX REPORT (GewSt)
━━━━━━━━━━━━━━━━━━━━━━━
Revenue: €44,812
Deductible Expenses:
- Software/Tools: €2,341
- Marketing: €892
- Conference (Berlin WordCamp): €445
- Hosting/Infrastructure: €3,234
- Contractors: €8,900

Net Income: €29,000
Estimated Tax (35%): €10,150
Due Date: August 15, 2025

📝 US TAX REPORT (Delaware LLC)
━━━━━━━━━━━━━━━━━━━━━━━━
Revenue: $31,450
Deductible Expenses:
- Software/SaaS: $3,234
- Cloudflare/AWS: $4,456
- Travel (US conferences): $2,340
- Marketing/Ads: $1,234
- Professional Services: $2,100

Net Income: $18,086
Estimated Tax (28%): $5,064
Quarterly Payment Due: June 15, 2025

🗂️ EXPENSE DOCUMENTATION
Found: 47 receipts
Categorized: 45
Missing: 2
- Cloudflare invoice for May
- WordPress.com renewal

✈️ BUSINESS TRAVEL
- May 3-7: WordCamp Berlin (€445 total)
- June 12-15: WP Conference NYC ($2,340 total)
- July 17: Flight to Newark (upcoming)

⚠️ ACTION ITEMS
1. Get missing Cloudflare invoice
2. Transfer €10,150 to tax account by Aug 10
3. Make US quarterly payment by June 15
4. Save 30% of this month's revenue for next quarter

📅 UPCOMING DEADLINES
- June 15: US quarterly payment ($5,064)
- August 15: German GewSt payment (€10,150)
- September 15: Q3 estimates due

💡 TAX OPTIMIZATION NOTES
- Conference travel is fully deductible
- Consider max retirement contribution
- EchoDash R&D might qualify for credits
- Review Delaware franchise tax requirement
```

## Document Storage
Reports are saved to:
- `/Users/jgarturo/Projects/Taxes/2025/Q2/`
- Backed up to Cloudflare R2

## Related Workflows
- [Monthly Revenue Analysis](./revenue-analysis.md)
- [Expense Tracking](../daily/expense-tracker.md)
- [Annual Tax Planning](./annual-tax-plan.md)

## Important Notes
- Always verify exchange rates for accurate conversion
- Keep 35% of revenue aside for taxes
- German payments due on 15th
- US quarterly payments required

## Change Log
- 2025-08-16: Created comprehensive dual-country version
- 2025-08-16: Added automatic receipt categorization
- 2025-08-16: Integrated travel expense matching
