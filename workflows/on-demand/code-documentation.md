# Code Documentation Assistant

## Command
```
Help me document and organize my current project:
1. Use Filesystem to scan project directory for all code files
2. For each major framework/library found, use Context7 to get latest documentation
3. Identify undocumented functions and create JSDoc/docstring templates
4. Check for outdated dependencies and suggest updates
5. Create a README.md with proper structure if missing
6. Generate API documentation in markdown format
7. Store code patterns in OpenMemory for future reference
8. Create Apple Reminders for documentation tasks that need manual review
```

## Prerequisites
- Filesystem MCP (for code scanning)
- Context7 MCP (for documentation lookup)
- OpenMemory MCP (for pattern storage)
- Apple Reminders MCP (for task creation)

## Frequency
On-demand (before releases or code reviews)

## Time Saved
- Manual documentation: 3-4 hours
- With automation: 15 minutes
- **Saved: 3+ hours per project**

## Variables You Can Customize
- `PROJECT_PATH`: "~/Projects/your-project"
- `LANGUAGES`: ["javascript", "python", "typescript"]
- `DOCUMENTATION_STYLE`: "JSDoc" | "Google" | "NumPy"
- `FRAMEWORKS_TO_CHECK`: ["react", "vue", "express", "fastapi"]
- `MIN_FUNCTION_SIZE`: 10 // lines to trigger documentation

## Success Metrics
- ✅ All code files scanned
- ✅ Documentation templates generated
- ✅ Dependencies checked
- ✅ README created/updated
- ✅ API docs generated

## Sample Output Format
```
📚 DOCUMENTATION ANALYSIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJECT STRUCTURE
• Files scanned: 47
• Languages: JavaScript (70%), TypeScript (30%)
• Frameworks detected: React 18.2, Express 4.18

📝 DOCUMENTATION COVERAGE
• Functions documented: 23/45 (51%)
• Classes documented: 8/12 (67%)
• Modules documented: 5/9 (56%)

🔍 CONTEXT7 INSIGHTS
• React 18.2: Found latest hooks documentation
• Express 4.18: Middleware patterns updated
• TypeScript 5.0: New decorators syntax available

⚠️ NEEDS DOCUMENTATION (Top 5)
1. `/src/utils/dataProcessor.js` - processUserData() - 45 lines
2. `/src/api/webhookHandler.js` - handleWebhook() - 38 lines
3. `/src/components/Dashboard.tsx` - calculateMetrics() - 32 lines
4. `/src/services/authService.js` - validateToken() - 28 lines
5. `/src/lib/cacheManager.js` - invalidateCache() - 25 lines

📦 DEPENDENCY STATUS
• Outdated: 4 packages
  - react: 18.2.0 → 18.3.0 (minor)
  - express: 4.18.0 → 4.19.0 (minor)
  - jest: 28.0.0 → 29.0.0 (major ⚠️)
  - eslint: 8.0.0 → 9.0.0 (major ⚠️)

📄 GENERATED DOCUMENTATION
✅ README.md - Created with standard sections
✅ API.md - 15 endpoints documented
✅ CONTRIBUTING.md - Generated from patterns
✅ Function templates - 22 JSDoc blocks ready

💾 PATTERNS STORED
• Authentication flow pattern
• Error handling pattern
• API response structure
• Component lifecycle pattern

✅ REMINDERS CREATED
1. Review and complete processUserData documentation
2. Update Jest to v29 and run tests
3. Add examples to API documentation
4. Create integration test documentation
```

## Generated File Examples

### JSDoc Template Generated
```javascript
/**
 * Processes user data and returns formatted result
 * @param {Object} userData - The user data object
 * @param {string} userData.id - User identifier
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Processed user data
 * @throws {ValidationError} If user data is invalid
 * @example
 * // TODO: Add usage example
 */
function processUserData(userData, options) {
  // existing code...
}
```

## Related Workflows
- [Code Review Prep](./code-review-prep.md)
- [API Testing Suite](../on-demand/api-testing.md)
- [Release Notes Generator](../weekly/release-notes.md)

## Troubleshooting
- Large codebases may need directory filtering
- Context7 requires library names to match their database
- Binary files are automatically skipped
