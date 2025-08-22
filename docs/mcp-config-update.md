# Claude Desktop Configuration Update

Add this to your `~/.cursor/mcp.json` file to enable the MCP Reloader server:

```json
{
  "mcpServers": {
    "claude-automation-hub": {
      "command": "node",
      "args": ["node_modules/mcp-reloader/dist/index.js"],
      "cwd": "~/Projects/claude-automation-hub",
      "autostart": true
    }
  }
}
```

## Alternative: Using Include Patterns

If you want to watch additional files and restart the server when they change:

```json
{
  "mcpServers": {
    "claude-automation-hub": {
      "command": "npx",
      "args": [
        "mcp-reloader",
        "--include", "workflows/**/*.md",
        "--include", "config/**/*.json"
      ],
      "cwd": "~/Projects/claude-automation-hub",
      "autostart": true
    }
  }
}
```

## Manual Installation Steps

1. Install mcp-reloader in the project:
   ```bash
   cd ~/Projects/claude-automation-hub
   npm install
   ```

2. Add the configuration above to your `~/.cursor/mcp.json` file

3. Restart Claude Desktop/Cursor

4. The tools in `./tools/` will be automatically available and hot-reloadable!
