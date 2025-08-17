# Testing Guide for Claude Automation Hub

## Prerequisites

Before testing workflows, ensure all required MCP tools are configured:

```bash
# Check MCP configuration
cat ~/.cursor/mcp.json

# Verify automation hub is in the config
grep "claude-automation-hub" ~/.cursor/mcp.json
```

## Testing Hot-Reloadable Tools

### 1. Verify Tool Loading

```
Ask Claude: "List all available MCP tools"
```

You should see your custom tools from `./tools/` directory:
- `analyze_hub_stats`
- `generate_workflow_template`
- `suggest_workflows`

### 2. Test Individual Tools

```javascript
// Test hub stats analyzer
Ask Claude: "Use analyze_hub_stats to show my automation metrics"

// Test workflow generator
Ask Claude: "Use generate_workflow_template to create a new daily workflow called 'Email Triage'"

// Test workflow suggester
Ask Claude: "Use suggest_workflows to recommend 5 productivity workflows"
```

### 3. Test Hot Reload

1. Modify any tool in `./tools/`
2. Save the file
3. Immediately test the updated tool (no restart needed!)

## Testing Workflows

### Daily Workflow Tests

#### Morning Routine Test
```
Test command: "Run my morning routine but only show what would happen, don't execute"

Expected outputs:
✓ Calendar events listed
✓ Gmail messages summarized
✓ WhatsApp messages checked
✓ Reminders displayed
✓ Spotify playlist ready
✓ Browser tabs listed
```

#### Support Triage Test
```
Test command: "Show me how morning support triage would work with sample data"

Verify:
✓ FreeScout connection works
✓ Ticket analysis runs
✓ Draft replies generated
✓ Notes can be added
✓ Reminders created
```

### Weekly Workflow Tests

#### Review & Planning Test
```
Test command: "Do a mini weekly review for the last 3 days"

Check for:
✓ Time analysis from calendar
✓ Task completion metrics
✓ Goal tracking
✓ Next week planning
✓ Deep work scheduling
```

### On-Demand Workflow Tests

#### Focus Mode Test
```
Test command: "Prepare focus mode but don't activate - just show the plan"

Validate:
✓ Spotify playlist selected
✓ Browser tabs identified
✓ Calendar checked
✓ Team notification drafted
✓ Reminders structured
```

#### Customer Communication Test
```
Test command: "Analyze customer communication for john@example.com from last 3 days"

Ensure:
✓ Multi-channel search works
✓ Sentiment analysis runs
✓ Patterns identified
✓ Follow-ups suggested
```

## Integration Testing

### Multi-Tool Workflows

Test workflows that combine multiple MCPs:

```bash
# Test Gmail + Calendar + Reminders
"Find all meetings tomorrow, check for prep emails, create reminder tasks"

# Test FreeScout + WhatsApp + OpenMemory
"Get high priority tickets, notify team via WhatsApp, store solutions"

# Test Filesystem + Context7 + OpenMemory
"Scan my project for undocumented functions and save patterns"
```

### Error Handling Tests

```bash
# Test with missing permissions
"Try to access a protected directory with Filesystem"

# Test with invalid data
"Search Gmail for messages from 'invalid@#$%.com'"

# Test rate limiting
"Get 1000 calendar events" (should handle pagination)
```

## Performance Testing

### Measure Execution Time

```javascript
// Add timing to any workflow
Ask Claude: "Time how long it takes to run morning routine"

Expected output:
- Step 1 (Calendar): 2.3s
- Step 2 (Gmail): 3.1s
- Step 3 (WhatsApp): 1.8s
- Total: 7.2s
```

### Load Testing

```bash
# Test with large datasets
"Analyze 100 support tickets from FreeScout"
"Process 500 emails from Gmail"
"Check 50 calendar events"
```

## Debugging Workflows

### Enable Verbose Output

```javascript
// Add debug flag to any workflow
"Run morning routine with debug output enabled"

Will show:
- API calls made
- Data retrieved
- Processing steps
- Any errors encountered
```

### Common Issues & Solutions

| Issue | Solution | Test Command |
|-------|----------|--------------|
| MCP not responding | Restart Claude/Cursor | "Test connection to Gmail MCP" |
| Tool not found | Check file exists in ./tools/ | "List custom MCP tools" |
| Workflow timeout | Break into smaller steps | "Run first 3 steps of morning routine" |
| Permission denied | Check MCP configuration | "Verify FreeScout permissions" |
| Rate limiting | Add delays between calls | "Test with 1 second delays" |

## Testing Checklist

### For New Workflows

- [ ] All required MCPs listed in prerequisites
- [ ] Test with minimal data first
- [ ] Verify each step independently
- [ ] Test error conditions
- [ ] Measure time saved
- [ ] Document sample output
- [ ] Test with real data
- [ ] Verify idempotency (safe to run multiple times)

### For Modified Workflows

- [ ] Test the specific changes
- [ ] Verify backward compatibility
- [ ] Update sample output if needed
- [ ] Test with edge cases
- [ ] Update time estimates

### For New Tools

- [ ] Tool loads without errors
- [ ] Input validation works
- [ ] Handler executes correctly
- [ ] Error handling works
- [ ] Output format is consistent
- [ ] Hot reload works

## Automated Testing

### Create Test Suite

```javascript
// Save as ./tools/test_suite.js
export default {
  name: "run_test_suite",
  description: "Run automated tests for all workflows",
  handler: async () => {
    const tests = [
      { name: "MCP Connectivity", test: "Check all MCPs responding" },
      { name: "Tool Loading", test: "Verify custom tools loaded" },
      { name: "Workflow Syntax", test: "Validate workflow files" },
      { name: "Permission Check", test: "Verify all permissions" }
    ];
    
    // Run tests and return results
    return { tests, status: "Tests would run here" };
  }
};
```

### Continuous Testing

Set up a reminder to test weekly:
```
"Create a weekly reminder to test automation hub workflows every Friday"
```

## Monitoring & Metrics

### Track Success Rate

```javascript
// Use OpenMemory to track
"Store workflow execution: morning-routine, success, 7.2 seconds"
"Get success rate for all workflows this week"
```

### Performance Tracking

```
"Show average execution time for each workflow"
"Which workflows have the highest failure rate?"
"What's the trend in time saved over the past month?"
```

## Rollback Procedures

If a workflow breaks:

1. **Immediate**: Use previous version from Git
2. **Debug**: Add verbose output to identify issue
3. **Fix**: Update workflow with correction
4. **Test**: Verify fix with test data
5. **Deploy**: Update workflow file
6. **Document**: Add to troubleshooting section

## Best Practices

1. **Always test with dry-run first** - Don't execute actions immediately
2. **Start small** - Test with limited data before full runs
3. **Version control everything** - Commit working versions before changes
4. **Document failures** - Add to troubleshooting guides
5. **Share test results** - Help others avoid same issues

---

*Remember: The best test is using the workflow in real conditions. Start with low-risk workflows and gradually increase complexity.*
