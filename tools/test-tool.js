// Simple test tool to verify MCP Reloader is working
export default {
  name: "test_mcp_reloader",
  description: "Test tool to verify MCP Reloader hot-reload functionality",
  inputSchema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Test message to echo back",
        default: "Hello from MCP Reloader!"
      }
    }
  },
  handler: async ({ message = "Hello from MCP Reloader!" }) => {
    const timestamp = new Date().toISOString();
    return {
      success: true,
      message: `✅ MCP Reloader is working! Echo: "${message}"`,
      timestamp,
      toolsDirectory: "./tools",
      hotReloadEnabled: true,
      instructions: "Try modifying this tool file - changes will be reflected immediately!"
    };
  }
};
