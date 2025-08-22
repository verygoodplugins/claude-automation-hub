# Clickable Links Setup (Experimental)

## Problem
Claude Desktop runs in a sandboxed environment that prevents direct file:// links from working. This makes it difficult to open files directly from Claude's responses.

## Solution
We've created a web proxy that converts file paths into clickable HTTP links that open in your default editor.

## Setup Instructions

### 1. Interactive Setup (Recommended)
```bash
npm run setup:links
```

This will guide you through:
- Installing dependencies
- Configuring your editor preference
- Starting the proxy server
- Testing the setup

### 2. Manual Setup

#### Install Dependencies
```bash
npm install
```

#### Start the Proxy
```bash
npm run proxy
```

The proxy will start on `http://localhost:8765`

#### Configure Your Editor
Set your preferred editor in `.env`:
```bash
CURSOR_DEFAULT_EDITOR=cursor  # or 'code' for VS Code
```

## How It Works

1. **File Path Detection:** The proxy detects file paths in Claude's responses
2. **Link Generation:** Converts `/path/to/file.js` to `http://localhost:8765/open?file=/path/to/file.js`
3. **Editor Launch:** Clicking the link opens the file in your configured editor
4. **Line Numbers:** Supports jumping to specific lines: `file.js:42`

## Usage

Once running, Claude can generate clickable links:
- "Open `/Users/you/project/file.js:42` in your editor"
- Becomes: [http://localhost:8765/open?file=/Users/you/project/file.js&line=42](http://localhost:8765/open?file=/Users/you/project/file.js&line=42)

## Security Considerations

⚠️ **Warning:** The proxy allows file system access via HTTP. 

**Default Configuration (Safe):**
- Binds to `localhost` only
- Not accessible from network
- Read-only file access

**Network Access (Use Caution):**
If you need network access (not recommended):
```bash
CURSOR_PROXY_BIND=0.0.0.0 npm run proxy
```

See [SECURITY.md](../SECURITY.md) for detailed security information.

## Troubleshooting

### Proxy Won't Start
- Check if port 8765 is already in use
- Try a different port: `CURSOR_PROXY_PORT=8766 npm run proxy`

### Links Don't Open
- Ensure your editor is in PATH
- Test manually: `cursor /path/to/file` or `code /path/to/file`
- Check browser allows localhost connections

### Editor Opens Wrong File
- Use absolute paths, not relative
- Ensure no special characters in path
- Try URL-encoding the path

## Limitations

- Only works while proxy is running
- Requires manual start after reboot
- May conflict with other local servers on port 8765
- Some browsers block localhost links in certain contexts

## Future Improvements

- [ ] Auto-start with system
- [ ] Browser extension for better integration  
- [ ] Support for more editors
- [ ] Direct MCP integration