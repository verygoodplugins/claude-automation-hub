# Hot-Reloadable MCP Tools 🔥

## Cursor CLI Integration

### `cursor_cli_deeplink`
**Core file and agent operations**

```javascript
// Open file at specific line
await cursor_cli_deeplink({
  action: "open",
  filePath: "src/component.js",
  lineNumber: 42
});

// Run AI analysis
await cursor_cli_deeplink({
  action: "agent", 
  prompt: "Fix the bug at line 42 in this component"
});
```

### `workflow_cursor_integration`
**Pre-built development workflows**

```javascript
// Debug workflow: open file + AI analysis
await workflow_cursor_integration({
  workflow: "debug_workflow",
  filePath: "src/scheduler.js",
  lineNumber: 156,
  issue: "Cron jobs not triggering",
  context: "Only happens in production"
});
```

**Available workflows**: `debug_workflow`, `review_code`, `analyze_project`, `fix_issue`, `create_documentation`, `refactor_code`

## Real-World Use Case

**Daily AI Dashboard** (like the example screenshot):
1. **Apple Reminders MCP** pulls tasks from iOS
2. **Cursor CLI tools** generate "Open in Cursor with Fix Instructions" buttons
3. **AI analysis** prioritizes and categorizes tasks

Result: Interactive dashboard with direct IDE deeplinks for every code task.

## Hot-Reload Development

1. **Create**: `tools/my-tool.js` with MCP tool structure
2. **Test**: Immediately available in Claude Desktop
3. **Iterate**: Modify code → automatic reload → test again
4. **No restarts** needed!

## Tool Structure

```javascript
export default {
  name: "my_tool",
  description: "What this tool does",
  inputSchema: {
    type: "object",
    properties: {
      param: { type: "string", description: "Parameter" }
    },
    required: ["param"]
  },
  handler: async ({ param }) => {
    return `Result: ${param}`;
  }
};
```