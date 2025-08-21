# Security & Privacy Guide 🔒

## Overview

This automation hub is designed with security and privacy in mind. This guide covers how to safely configure and use the tools without exposing sensitive information.

## 🔑 Environment Variables Setup

### Required Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Customize your settings:**
   ```bash
   # Generate a unique NTFY topic
   export NTFY_TOPIC="claude-automation-$(whoami)-$(openssl rand -hex 4)"
   
   # Add to your .env file
   echo "NTFY_TOPIC=$NTFY_TOPIC" >> .env
   ```

3. **Set your timezone and work hours:**
   ```bash
   echo "TIMEZONE=America/New_York" >> .env
   echo "WORK_START_HOUR=8" >> .env
   echo "WORK_END_HOUR=17" >> .env
   ```

### MCP Configuration Path Security

The automation hub auto-detects your Claude Desktop configuration, but you can override:

```bash
# For Cursor users
CLAUDE_CONFIG_PATH=~/.cursor/mcp.json

# For Claude Desktop users  
CLAUDE_CONFIG_PATH=~/.claude/claude_desktop_config.json
```

## 🛡️ Security Best Practices

### 1. Never Commit Sensitive Data

**✅ Safe to commit:**
- `.env.example` (template with placeholders)
- Workflow templates with `<placeholder>` values
- Documentation with example paths

**❌ Never commit:**
- `.env` file (contains your actual secrets)
- Real API keys, tokens, or passwords
- Personal file paths or URLs
- Customer-specific data

### 2. Use Environment Variables

**Instead of hardcoding:**
```javascript
// ❌ Bad - hardcoded
const apiKey = "sk-1234567890abcdef";
const serverUrl = "https://my-company.freescout.com";
```

**Use environment variables:**
```javascript
// ✅ Good - environment variable
const apiKey = process.env.FREESCOUT_API_TOKEN;
const serverUrl = process.env.FREESCOUT_API_URL;
```

### 3. Validate Environment Variables

All tools should validate required environment variables:

```javascript
if (!process.env.REQUIRED_API_KEY) {
  return {
    success: false,
    error: "REQUIRED_API_KEY environment variable not set. Please check your .env file.",
    setup: "Run: echo 'REQUIRED_API_KEY=your_key_here' >> .env"
  };
}
```

## 📱 NTFY Security

### Topic Security

Your NTFY topic acts as a "password" - anyone who knows it can send notifications to your devices.

**Generate a secure topic:**
```bash
# Good - random and unique
NTFY_TOPIC="claude-automation-$(whoami)-$(openssl rand -hex 8)"

# Bad - predictable
NTFY_TOPIC="claude-automation-alerts"
```

### Mobile Setup Security

1. **Use the official ntfy mobile apps** (don't trust unofficial apps)
2. **Subscribe to your unique topic only**
3. **Don't share your topic** in screenshots or documentation
4. **Regularly rotate topics** if you suspect compromise

## 🔧 Tool-Specific Security

### Cursor CLI Integration

**Secure defaults:**
- Uses `process.cwd()` for dynamic project detection
- Respects `CURSOR_DEFAULT_PROJECT` environment variable
- No hardcoded file paths in the tools

**Web Proxy Security:**
- **Localhost-only**: Only accepts connections from localhost/127.0.0.1 by default
- **Task expiration**: All tasks expire after 24 hours automatically
- **Input validation**: All file paths and prompts are validated
- **Rate limiting**: Maximum 1000 concurrent tasks
- **Path traversal protection**: Prevents `../` and other malicious paths
- **No persistence**: Tasks stored in memory only, cleared on restart

### Network Binding Configuration

#### Default (Secure)
```bash
# Default binding - recommended for most users
CURSOR_PROXY_BIND=localhost
# OR omit entirely - localhost is the default
```

**Security features:**
- Binds to `localhost` only
- No network exposure
- Safe for all environments

#### Network Access (Advanced Users Only)

Set `CURSOR_PROXY_BIND` to enable network access:

```bash
# WARNING: Exposes proxy to entire network
CURSOR_PROXY_BIND=0.0.0.0

# More secure: Bind to specific network interface
CURSOR_PROXY_BIND=192.168.1.100
```

**⚠️ Security Considerations:**

1. **Only use on trusted networks** (home/office WiFi with WPA3)
2. **Never use on public WiFi** or untrusted networks
3. **Monitor access logs** - proxy logs all network requests with IP addresses
4. **Consider firewall rules** to limit access to specific devices
5. **Be aware**: This proxy can execute commands on your system

**Risk Assessment:**
- **High Risk**: Public networks, shared WiFi, coffee shops
- **Medium Risk**: Corporate networks, shared office spaces  
- **Low Risk**: Home networks, private office networks
- **Acceptable**: Isolated VLANs, VPN-only networks

**Mitigation Strategies:**
```bash
# Option 1: Use specific IP binding instead of 0.0.0.0
CURSOR_PROXY_BIND=192.168.1.100

# Option 2: Use firewall to limit access
sudo ufw allow from 192.168.1.0/24 to any port 8765

# Option 3: Use VPN for remote access instead
# Connect via VPN, then use localhost binding
```

**Monitoring Network Access:**
When network access is enabled, the proxy logs all requests:
```
[NETWORK] Request from 192.168.1.50 to /cursor/abc123
[NETWORK] Request from 10.0.0.25 to /register
```

Monitor these logs for:
- Unexpected IP addresses
- High frequency requests (potential abuse)
- Requests from outside your expected network range

**Legitimate Use Cases for Network Access:**
- Mobile apps triggering development tasks
- Home automation integration (HomeKit, Home Assistant)
- Remote development from another computer on LAN
- Team collaboration in trusted office environment
- Integration with local services (NAS, Raspberry Pi)

**Setup command output includes env variables:**
```bash
# When setting up Cursor CLI tools, commands should output:
echo "Add to your .env file:"
echo "CURSOR_DEFAULT_MODEL=claude-3-5-sonnet-20241022"
echo "CURSOR_DEFAULT_PROJECT=/path/to/your/main/project"
echo "CURSOR_PROXY_PORT=8765"
```

### Custom Tool Development

**Security checklist for new tools:**
- [ ] No hardcoded API keys or secrets
- [ ] Environment variables validated with helpful error messages
- [ ] No logging of sensitive data
- [ ] Input validation for all parameters
- [ ] Safe file path handling (no path traversal)

## 🚫 What NOT to Include in Tools

### Sensitive Information
- API keys, tokens, passwords
- Personal file paths (use environment variables)
- Customer names, emails, or data
- Server URLs or internal hostnames
- Database connection strings

### Personal Configuration
- Absolute file paths
- Usernames or home directory paths
- Company-specific URLs or identifiers
- Personal timezone or work schedule (use env vars)

## 🔍 Security Audit Commands

### Check for hardcoded secrets:
```bash
# Search for potential API keys
grep -r "sk-\|key\|token\|password" tools/ --exclude-dir=node_modules

# Search for hardcoded paths
grep -r "/Users/\|/home/\|C:\\" tools/ --exclude-dir=node_modules

# Search for URLs
grep -r "https://.*\.com" tools/ --exclude-dir=node_modules
```

### Environment Variable Usage:
```bash
# Check which tools use environment variables
grep -r "process\.env" tools/

# Verify .env.example is comprehensive
diff <(grep "process\.env\." tools/* | sed 's/.*process\.env\.\([A-Z_]*\).*/\1/' | sort -u) <(grep "^[A-Z_]*=" .env.example | cut -d= -f1 | sort)
```

## 🚨 Incident Response

### If You Accidentally Commit Secrets

1. **Immediately rotate the compromised credentials**
2. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push to overwrite remote history**
4. **Update .gitignore to prevent future issues**

### If NTFY Topic is Compromised

1. **Generate a new topic:**
   ```bash
   NTFY_TOPIC="claude-automation-$(whoami)-$(openssl rand -hex 8)"
   ```
2. **Update your .env file**
3. **Update mobile app subscription**
4. **Test with a new notification**

## ✅ Security Checklist for New Users

- [ ] Copied `.env.example` to `.env` 
- [ ] Generated unique NTFY topic
- [ ] Set timezone and work hours
- [ ] Added `.env` to `.gitignore` (already included)
- [ ] Verified no hardcoded paths in configuration
- [ ] Tested tools with environment variables
- [ ] Read MCP server security documentation
- [ ] Reviewed tool permissions before enabling

## 📚 Additional Resources

- [MCP Security Best Practices](https://modelcontextprotocol.io/docs/security)
- [NTFY Security Documentation](https://docs.ntfy.sh/config/)
- [Environment Variables in Node.js](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)

---

**Remember:** Security is an ongoing process. Regularly audit your tools and configuration as you add new integrations.