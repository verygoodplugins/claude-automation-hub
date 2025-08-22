# Enhanced MCP Setup Guide

This guide covers the advanced MCP features in Claude Automation Hub that significantly improve the development and automation experience.

## Table of Contents

1. [Node.js Version Management](#nodejs-version-management)
2. [Browser Profile Management](#browser-profile-management)
3. [Integration Examples](#integration-examples)
4. [Troubleshooting](#troubleshooting)

## Node.js Version Management

### The Problem

Claude Desktop often uses the system's default Node.js version instead of your NVM-managed version, causing MCP servers to fail with version conflicts or missing dependencies.

### The Solution

The `npx-for-claude` wrapper automatically loads your correct Node.js version for all MCP servers.

### Installation

```bash
# Run the automated setup
./scripts/setup-npx-wrapper.sh
```

This creates `/usr/local/bin/npx-for-claude` with the following features:

- ✅ Automatically loads `~/.zshrc` (or your shell config)
- ✅ Detects and uses NVM's default Node version
- ✅ Falls back gracefully if NVM isn't available
- ✅ Works with any Node version manager

### Configuration

Update your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "openmemory": {
      "command": "npx-for-claude",
      "args": ["-y", "openmemory"],
      "env": {
        "OPENMEMORY_API_KEY": "your-key"
      }
    },
    "context7": {
      "command": "npx-for-claude",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "freescout": {
      "command": "npx-for-claude",
      "args": ["@verygoodplugins/mcp-freescout@latest"],
      "env": {
        "FREESCOUT_URL": "https://your-site.com",
        "FREESCOUT_API_KEY": "your-key"
      }
    }
  }
}
```

### Verification

```bash
# Test the wrapper
/usr/local/bin/npx-for-claude --version

# Should show your NVM Node version, not system version
node --version
```

## Browser Profile Management

### The Problem

Web automation loses login sessions between runs, requiring manual re-authentication for every task.

### The Solution

Persistent browser profiles that maintain login sessions, cookies, and browser state across automation runs.

### Setup

```bash
# Create profiles for different purposes
node tools/browser-profile-manager.js create gmail-work
node tools/browser-profile-manager.js create social-media  
node tools/browser-profile-manager.js create admin-dashboard
node tools/browser-profile-manager.js create testing-env
```

### Profile Management

```bash
# List all profiles
node tools/browser-profile-manager.js list

# Get detailed info
node tools/browser-profile-manager.js info gmail-work

# Interactive management
node tools/browser-profile-manager.js interactive

# Delete a profile
node tools/browser-profile-manager.js delete old-profile
```

### Usage in Code

#### Basic Usage

```javascript
import { BrowserProfileManager } from './src/browser/profile-manager.js';

const profileManager = new BrowserProfileManager();

// Launch with profile
const options = profileManager.getPlaywrightOptions('gmail-work');
const browser = await playwright.chromium.launch(options);
const page = await browser.newPage();

// Your automation code here
await page.goto('https://gmail.com');
// Login state is preserved!
```

#### Advanced Usage with Login Automation

```javascript
import { BrowserAutomationWithProfiles } from './tools/browser-automation-with-profiles.js';

const automation = new BrowserAutomationWithProfiles();

// Launch browser with profile
const session = await automation.launchWithProfile('gmail-work');

// Navigate and check login status
const result = await automation.navigateWithSession(
  session.sessionId, 
  'https://gmail.com'
);

if (result.loginStatus.needsLogin) {
  // Perform automated login
  await automation.performLogin(session.sessionId, {
    username: 'your-email@gmail.com',
    password: 'your-password'
  });
}

// Continue with automation...
await automation.closeSession(session.sessionId);
```

### Profile Storage

Profiles are stored in `~/.claude-automation-hub/browser-profiles/`:

```
~/.claude-automation-hub/
└── browser-profiles/
    ├── gmail-work/          # Chrome user data
    ├── social-media/        # Separate profile
    └── admin-dashboard/     # Another profile
```

Each profile contains:
- Cookies and session data
- Browser preferences
- Extensions (if installed)
- Saved passwords (if enabled)
- Browsing history

## Integration Examples

### Example 1: Gmail Automation with Persistent Login

```javascript
// Create profile once
// node tools/browser-profile-manager.js create gmail-automation

import { BrowserProfileManager } from './src/browser/profile-manager.js';
import { chromium } from 'playwright';

const profileManager = new BrowserProfileManager();

async function automateGmail() {
  const options = profileManager.getPlaywrightOptions('gmail-automation');
  const browser = await chromium.launch(options);
  const page = await browser.newPage();
  
  await page.goto('https://gmail.com');
  
  // First run: you'll need to login manually
  // Subsequent runs: automatically logged in!
  
  // Your Gmail automation here
  const unreadCount = await page.locator('[aria-label*="unread"]').count();
  console.log(`Unread emails: ${unreadCount}`);
  
  await browser.close();
}
```

### Example 2: Multi-Site Social Media Management

```javascript
const profiles = ['twitter-main', 'linkedin-work', 'instagram-brand'];

for (const profile of profiles) {
  const options = profileManager.getPlaywrightOptions(profile);
  const browser = await chromium.launch(options);
  const page = await browser.newPage();
  
  // Each profile maintains separate login sessions
  await automatePosting(page, profile);
  
  await browser.close();
}
```

### Example 3: WordPress Admin Tasks

```javascript
// Create profile: node tools/browser-profile-manager.js create wp-admin

async function manageWordPress() {
  const options = profileManager.getPlaywrightOptions('wp-admin');
  const browser = await chromium.launch(options);
  const page = await browser.newPage();
  
  await page.goto('https://yoursite.com/wp-admin');
  
  // Login persisted from previous sessions
  await page.click('text=Posts');
  await page.click('text=Add New');
  
  // Automate post creation
  await page.fill('#title', 'Automated Post');
  await page.fill('#content', 'Content created by automation');
  
  await browser.close();
}
```

## Troubleshooting

### Node Version Issues

**Problem**: MCP server fails with "module not found" or version errors

**Solution**: 
```bash
# Verify npx-for-claude is working
/usr/local/bin/npx-for-claude --version

# Check if it matches your NVM version
node --version

# If different, check your shell config
source ~/.zshrc
nvm current
```

**Common fixes**:
- Ensure NVM is properly installed
- Check that `~/.zshrc` loads NVM
- Restart Claude Desktop after setup

### Browser Profile Issues

**Problem**: Profile not saving login state

**Solution**:
```bash
# Check profile exists
node tools/browser-profile-manager.js list

# Verify profile path
node tools/browser-profile-manager.js info your-profile

# Check permissions
ls -la ~/.claude-automation-hub/browser-profiles/
```

**Common fixes**:
- Ensure you're not using incognito/private mode
- Check that cookies are enabled
- Verify profile directory has write permissions

### Permission Issues

**Problem**: Cannot create `/usr/local/bin/npx-for-claude`

**Solution**:
```bash
# Check if directory exists
ls -la /usr/local/bin/

# Create if missing
sudo mkdir -p /usr/local/bin

# Re-run setup
./scripts/setup-npx-wrapper.sh
```

### Profile Cleanup

**Problem**: Profiles taking too much disk space

**Solution**:
```bash
# Check profile sizes
node tools/browser-profile-manager.js list

# Delete unused profiles
node tools/browser-profile-manager.js delete old-profile

# Or interactive cleanup
node tools/browser-profile-manager.js interactive
```

## Best Practices

### Node Version Management

1. **Use consistent versions**: Set a default Node version with `nvm alias default 18.17.0`
2. **Test after updates**: Verify MCP servers after Node version changes
3. **Monitor logs**: Check Claude Desktop logs for version-related errors

### Browser Profiles

1. **Organize by purpose**: Create separate profiles for different sites/tasks
2. **Regular cleanup**: Delete unused profiles to save disk space
3. **Security**: Use separate profiles for sensitive vs. public sites
4. **Backup important profiles**: Copy profile directories before major changes

### Integration

1. **Error handling**: Always wrap browser automation in try/catch blocks
2. **Session management**: Close browser sessions properly to avoid memory leaks
3. **Login detection**: Check login status before proceeding with automation
4. **Rate limiting**: Add delays between actions to avoid detection

## Advanced Configuration

### Custom Shell Configuration

If you use a shell other than zsh, update the npx wrapper:

```bash
sudo nano /usr/local/bin/npx-for-claude
```

Change the source line:
```bash
# For bash
source ~/.bashrc

# For fish
source ~/.config/fish/config.fish
```

### Custom Profile Location

Override the default profile location:

```javascript
import { BrowserProfileManager } from './src/browser/profile-manager.js';

class CustomProfileManager extends BrowserProfileManager {
  constructor() {
    super();
    this.profilesDir = '/custom/path/to/profiles';
    this.ensureProfilesDirectory();
  }
}
```

### Headless Mode with Profiles

```javascript
const options = profileManager.getPlaywrightOptions('profile-name', {
  headless: true,  // Run in background
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
```

This setup provides a robust foundation for both MCP server reliability and persistent web automation sessions, significantly improving the Claude Desktop experience for development and automation workflows.
