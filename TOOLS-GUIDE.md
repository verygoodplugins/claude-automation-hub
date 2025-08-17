# MCP Tools Development Guide

## Quick Start

Your automation hub now supports **hot-reloadable MCP tools**! No more restarting Claude Desktop when you create or modify tools.

## Setup Instructions

1. **Install dependencies**: `npm install` (already done)
2. **Update MCP config**: Add the configuration from `mcp-config-update.md` to your `~/.cursor/mcp.json`
3. **Restart Claude Desktop/Cursor**
4. **Test**: Use the `test_mcp_reloader` tool to verify everything works

## Creating Custom Tools

### 1. Basic Tool Structure

Create a `.js` file in the `./tools/` directory:

```javascript
export default {
  name: "tool_name",
  description: "What your tool does",
  inputSchema: {
    type: "object",
    properties: {
      param1: {
        type: "string", 
        description: "Parameter description"
      }
    },
    required: ["param1"]
  },
  handler: async ({ param1 }) => {
    // Your tool logic here
    return `Result: ${param1}`;
  }
};
```

### 2. Advanced Example: File Operations

```javascript
import { readFile, writeFile } from 'fs/promises';

export default {
  name: "manage_workflow_file",
  description: "Read or write workflow files",
  inputSchema: {
    type: "object",
    properties: {
      action: { type: "string", enum: ["read", "write"] },
      filename: { type: "string" },
      content: { type: "string" }
    },
    required: ["action", "filename"]
  },
  handler: async ({ action, filename, content }) => {
    const filepath = `./workflows/${filename}`;
    
    if (action === "read") {
      const data = await readFile(filepath, 'utf-8');
      return { success: true, content: data };
    } else if (action === "write") {
      await writeFile(filepath, content);
      return { success: true, message: `Wrote to ${filepath}` };
    }
  }
};
```

### 3. Integration Tool Example

```javascript
export default {
  name: "freescout_quick_stats",
  description: "Get quick stats from FreeScout integration",
  inputSchema: {
    type: "object",
    properties: {
      days: { type: "number", default: 7 }
    }
  },
  handler: async ({ days = 7 }) => {
    // This would use your existing FreeScout MCP integration
    return {
      message: `This tool can call other MCP integrations`,
      suggestion: "Use mcp_freescout_* tools within this handler",
      timeframe: `Last ${days} days`
    };
  }
};
```

## Best Practices

### Tool Naming
- Use `snake_case` for tool names
- Be descriptive: `generate_support_report` not `report`
- Prefix with category: `workflow_generate_template`

### Input Validation
```javascript
inputSchema: {
  type: "object",
  properties: {
    email: {
      type: "string",
      pattern: "^[^@]+@[^@]+\\.[^@]+$",
      description: "Valid email address"
    },
    priority: {
      type: "string", 
      enum: ["low", "medium", "high"],
      default: "medium"
    }
  },
  required: ["email"]
}
```

### Error Handling
```javascript
handler: async ({ input }) => {
  try {
    // Your logic here
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      help: "Check your input parameters"
    };
  }
}
```

### Async Operations
```javascript
handler: async ({ url }) => {
  // File operations
  const data = await readFile('./data.json', 'utf-8');
  
  // HTTP requests
  const response = await fetch(url);
  const result = await response.json();
  
  // Database queries (if you have DB access)
  // const rows = await query('SELECT * FROM table');
  
  return { data, result };
}
```

## Testing Your Tools

1. **Save** your tool file in `./tools/`
2. **Immediately available** - no restart needed
3. **Test** by asking Claude to use your tool
4. **Iterate** - modify the file and test again

## Built-in Hub Tools

- `test_mcp_reloader` - Verify hot-reload is working
- `generate_workflow_template` - Create workflow templates  
- `analyze_hub_stats` - Analyze your automation hub

## Debugging Tips

1. **Check tool syntax**: Invalid JavaScript will prevent loading
2. **Verify exports**: Must use `export default { ... }`
3. **Test incrementally**: Start simple, add complexity
4. **Use console.log**: Outputs appear in MCP server logs
5. **Return objects**: Structured data is easier to work with

## Integration with Existing MCPs

Your tools can leverage existing MCP integrations:

```javascript
// Example: Tool that uses multiple integrations
export default {
  name: "support_dashboard_update",
  handler: async ({ ticketId }) => {
    // This tool could orchestrate multiple MCP calls:
    // 1. Get ticket from FreeScout MCP
    // 2. Query related data from Postgres MCP  
    // 3. Update browser automation
    // 4. Send notifications
    
    return "Orchestrated multiple MCP integrations";
  }
};
```

## Next Steps

1. **Create your first tool** - Start with something simple
2. **Test the hot-reload** - Modify and see instant changes  
3. **Build workflow-specific tools** - Automate your common tasks
4. **Share useful tools** - Add them to your workflow documentation

Happy tool building! 🛠️
