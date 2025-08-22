# Troubleshooting Guide

## Common Issues & Solutions

### Claude Desktop Can't Find MCP Tools

**Problem:** "I don't have access to that tool" error in Claude Desktop

**Solution:**
1. Check your config file is in the right location:
   - Mac: `~/.claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Restart Claude Desktop after config changes
3. Verify JSON syntax is correct (no trailing commas)

### MCP Tool Fails to Start

**Problem:** Tool shows as unavailable or errors on startup

**Solution:**
1. Test the MCP command manually:
   ```bash
   npx -y @modelcontextprotocol/server-filesystem ~/Documents
   ```
2. Check if you need to authenticate (Gmail, Calendar require OAuth)
3. Ensure Node.js is installed: `node --version`

### Gmail/Calendar Authentication Issues

**Problem:** Can't connect to Gmail or Google Calendar

**Solution:**
1. Run the OAuth setup:
   ```bash
   npx -y @crosshatch/gmail-mcp --auth
   ```
2. Follow the browser authentication flow
3. Copy the token to your config file

### Workflow Doesn't Execute Properly

**Problem:** Claude acknowledges the command but doesn't complete all steps

**Solution:**
1. Break complex workflows into smaller steps
2. Verify all required MCPs are installed
3. Check if specific tools need additional permissions

### Scheduler Not Running Workflows

**Problem:** Automated workflows don't trigger at scheduled times

**Solution:**
1. Ensure scheduler is running: `npm run scheduler`
2. Check timezone settings in `.env`
3. Verify workflow names match exactly in scheduler config

### File Permission Errors

**Problem:** Can't read/write files with Filesystem MCP

**Solution:**
1. Check the path in your config allows access to the directory
2. Use full paths instead of relative paths
3. Ensure Claude Desktop has file system permissions (Mac: System Preferences > Security & Privacy)

## Getting Help

If these solutions don't resolve your issue:

1. **Check existing issues:** [GitHub Issues](https://github.com/yourusername/claude-automation-hub/issues)
2. **Open a new issue** with:
   - Your OS and Claude Desktop version
   - The exact error message
   - Your config file (remove any sensitive data)
   - Steps to reproduce the problem
3. **Community Discord:** [Join our Discord](https://discord.gg/claude-automation) (if applicable)

## Debug Mode

Enable verbose logging to diagnose issues:

1. Set environment variable:
   ```bash
   export DEBUG=true
   ```

2. Run Claude Desktop from terminal to see logs:
   ```bash
   /Applications/Claude.app/Contents/MacOS/Claude
   ```

3. Check MCP server logs in:
   - Mac: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\Logs\`