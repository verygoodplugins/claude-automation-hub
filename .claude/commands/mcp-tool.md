# MCP Tool Creator

Create or modify MCP tool: $ARGUMENTS

## Task

I'll help you create hot-reloadable MCP tools by:

1. Creating new tools in the `./tools/` directory
2. Implementing tool handlers with proper schema
3. Testing tools with the mcp-reloader system
4. Integrating with existing automation workflows
5. Adding error handling and validation
6. Documentation and examples

## Tool Structure

Each tool follows this pattern:

```javascript
export default {
  name: "tool_name",
  description: "What this tool does",
  inputSchema: {
    type: "object",
    properties: {
      param: { 
        type: "string", 
        description: "Parameter description" 
      }
    },
    required: ["param"]
  },
  handler: async ({ param }) => {
    // Tool logic here
    return `Result: ${param}`;
  }
};
```

## Process

1. Check existing tools for patterns and conventions
2. Design the tool's input schema and functionality
3. Implement the handler with proper error handling
4. Test using `npm run test-tools`
5. Integrate with workflows if applicable
6. Document usage in tool comments

## Tool Categories

- **Notifications**: NTFY integration, bundling
- **Workflow**: Automation helpers, generators
- **Analytics**: Hub stats, metrics tracking
- **Integration**: Cursor CLI, browser automation
- **Context**: OpenMemory storage, retrieval

## Hot-Reload Benefits

- No server restart needed
- Immediate availability after save
- Real-time testing and iteration
- Seamless workflow integration

I'll help you create effective MCP tools that integrate with your automation hub.