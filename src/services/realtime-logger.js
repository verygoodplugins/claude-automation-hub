/**
 * Real-time logging system for MCP and Claude interactions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RealtimeLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.logFile = path.join(this.logDir, `mcp-${new Date().toISOString().split('T')[0]}.log`);
    
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data })
    };
    
    // Console output with color coding
    const colors = {
      INFO: '\x1b[36m',
      SUCCESS: '\x1b[32m',
      WARNING: '\x1b[33m',
      ERROR: '\x1b[31m',
      DEBUG: '\x1b[90m'
    };
    
    const color = colors[level] || '';
    const reset = '\x1b[0m';
    
    console.log(`${color}[${timestamp}] ${level}: ${message}${reset}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    
    // File output
    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
  }
  
  info(message, data) {
    this.log('INFO', message, data);
  }
  
  success(message, data) {
    this.log('SUCCESS', message, data);
  }
  
  warning(message, data) {
    this.log('WARNING', message, data);
  }
  
  error(message, data) {
    this.log('ERROR', message, data);
  }
  
  debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, data);
    }
  }
  
  // MCP-specific logging
  mcpServerStart(serverName, config) {
    this.success(`MCP Server Starting: ${serverName}`, {
      command: config.command,
      args: config.args
    });
  }
  
  mcpServerReady(serverName, toolCount) {
    this.success(`MCP Server Ready: ${serverName}`, {
      tools: toolCount
    });
  }
  
  mcpToolCall(serverName, toolName, args) {
    this.info(`MCP Tool Call: ${serverName}.${toolName}`, args);
  }
  
  mcpToolResult(serverName, toolName, result, duration) {
    this.success(`MCP Tool Result: ${serverName}.${toolName}`, {
      duration: `${duration}ms`,
      result
    });
  }
  
  mcpError(serverName, error) {
    this.error(`MCP Error: ${serverName}`, {
      error: error.message,
      stack: error.stack
    });
  }
  
  // Claude-specific logging
  claudeRequest(user, message) {
    this.info(`Claude Request from ${user}`, { message });
  }
  
  claudeResponse(response, tokens) {
    this.success('Claude Response', {
      tokensIn: tokens?.prompt_tokens,
      tokensOut: tokens?.completion_tokens,
      responseLength: response?.length
    });
  }
  
  // Slack-specific logging
  slackCommand(command, user, text) {
    this.info(`Slack Command: ${command}`, {
      user,
      text
    });
  }
  
  slackResponse(success, error = null) {
    if (success) {
      this.success('Slack Response Sent');
    } else {
      this.error('Slack Response Failed', { error });
    }
  }
  
  // Get recent logs for display
  getRecentLogs(count = 100) {
    try {
      const logs = fs.readFileSync(this.logFile, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .slice(-count)
        .map(line => JSON.parse(line));
      
      return logs;
    } catch (error) {
      return [];
    }
  }
}

// Export singleton instance
const logger = new RealtimeLogger();
export { logger };