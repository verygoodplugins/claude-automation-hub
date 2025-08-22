#!/usr/bin/env node
/**
 * Slack Integration Health Monitor
 * 
 * Continuously monitors the health of your Slack integration and
 * automatically attempts to fix common issues.
 */

import fetch from 'node-fetch';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);

// Load environment
dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });

// Configuration
const MONITOR_INTERVAL = 60000; // Check every minute
const TOKEN_CHECK_INTERVAL = 3600000; // Check tokens every hour
const AUTO_RESTART_ENABLED = process.env.AUTO_RESTART !== 'false';
const NTFY_TOPIC = process.env.NTFY_TOPIC;
const LOG_FILE = path.join(__dirname, 'health-monitor.log');

// State
const state = {
  startTime: Date.now(),
  lastCheck: null,
  lastTokenCheck: null,
  checks: {
    total: 0,
    successful: 0,
    failed: 0
  },
  restarts: {
    server: 0,
    tunnel: 0
  },
  issues: [],
  status: 'starting'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  // Write to file
  fs.appendFileSync(LOG_FILE, logEntry);
  
  // Console output with colors
  let color = colors.reset;
  switch(level) {
    case 'error': color = colors.red; break;
    case 'warning': color = colors.yellow; break;
    case 'success': color = colors.green; break;
    case 'info': color = colors.cyan; break;
  }
  
  console.log(`${color}[${new Date().toLocaleTimeString()}] ${message}${colors.reset}`);
}

// Send notification via NTFY
async function sendNotification(title, message, priority = 'default') {
  if (!NTFY_TOPIC) return;
  
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      body: message,
      headers: {
        'Title': title,
        'Priority': priority,
        'Tags': 'warning,slack'
      }
    });
  } catch (error) {
    log(`Failed to send notification: ${error.message}`, 'error');
  }
}

// Check local server health
async function checkLocalServer() {
  try {
    const response = await fetch('http://localhost:8765/health', {
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        healthy: true,
        uptime: data.uptime,
        version: data.version
      };
    }
    
    return { healthy: false, error: `Status ${response.status}` };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
}

// Check tunnel connectivity
async function checkTunnel() {
  try {
    const response = await fetch('https://automation.verygoodplugins.com/health', {
      timeout: 10000
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        healthy: true,
        accessible: true
      };
    }
    
    return { healthy: false, error: `Status ${response.status}` };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
}

// Check Slack token validity
async function checkSlackTokens() {
  const results = {
    bot: { valid: false },
    user: { valid: false }
  };
  
  // Check bot token
  if (process.env.SLACK_BOT_TOKEN) {
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: { 'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}` }
      });
      const data = await response.json();
      
      results.bot = {
        valid: data.ok,
        user: data.user,
        team: data.team,
        error: data.error
      };
    } catch (error) {
      results.bot.error = error.message;
    }
  }
  
  // Check user token
  if (process.env.SLACK_USER_TOKEN) {
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: { 'Authorization': `Bearer ${process.env.SLACK_USER_TOKEN}` }
      });
      const data = await response.json();
      
      results.user = {
        valid: data.ok,
        user: data.user,
        team: data.team,
        error: data.error
      };
    } catch (error) {
      results.user.error = error.message;
    }
  }
  
  return results;
}

// Restart local server
async function restartServer() {
  log('Attempting to restart local server...', 'warning');
  
  try {
    // Kill existing server
    const { exec } = await import('child_process');
    await new Promise((resolve) => {
      exec('lsof -ti :8765 | xargs kill -9', () => resolve());
    });
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start new server
    const serverProcess = spawn('node', [
      path.join(PROJECT_ROOT, 'src/proxy/cursor-web-proxy.js')
    ], {
      detached: true,
      stdio: 'ignore'
    });
    serverProcess.unref();
    
    // Wait for it to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify it's running
    const health = await checkLocalServer();
    if (health.healthy) {
      log('Server restarted successfully', 'success');
      state.restarts.server++;
      return true;
    }
    
    log('Server restart failed', 'error');
    return false;
  } catch (error) {
    log(`Server restart error: ${error.message}`, 'error');
    return false;
  }
}

// Restart tunnel
async function restartTunnel() {
  log('Attempting to restart Cloudflare tunnel...', 'warning');
  
  try {
    // Kill existing tunnel
    const { exec } = await import('child_process');
    await new Promise((resolve) => {
      exec('pkill -f cloudflared', () => resolve());
    });
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start new tunnel
    const tunnelProcess = spawn('bash', [
      path.join(PROJECT_ROOT, 'cloudflare-tunnel/start-tunnel.sh')
    ], {
      detached: true,
      stdio: 'ignore'
    });
    tunnelProcess.unref();
    
    // Wait for it to connect
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify it's running
    const health = await checkTunnel();
    if (health.healthy) {
      log('Tunnel restarted successfully', 'success');
      state.restarts.tunnel++;
      return true;
    }
    
    log('Tunnel restart failed', 'error');
    return false;
  } catch (error) {
    log(`Tunnel restart error: ${error.message}`, 'error');
    return false;
  }
}

// Main health check
async function performHealthCheck() {
  state.checks.total++;
  const issues = [];
  
  // Check local server
  const serverHealth = await checkLocalServer();
  if (!serverHealth.healthy) {
    issues.push({
      component: 'server',
      error: serverHealth.error,
      action: 'restart'
    });
    log(`Server unhealthy: ${serverHealth.error}`, 'error');
  } else {
    log(`Server healthy (uptime: ${Math.round(serverHealth.uptime)}s)`, 'success');
  }
  
  // Check tunnel
  const tunnelHealth = await checkTunnel();
  if (!tunnelHealth.healthy) {
    issues.push({
      component: 'tunnel',
      error: tunnelHealth.error,
      action: 'restart'
    });
    log(`Tunnel unhealthy: ${tunnelHealth.error}`, 'error');
  } else {
    log('Tunnel healthy', 'success');
  }
  
  // Check tokens periodically
  const now = Date.now();
  if (!state.lastTokenCheck || (now - state.lastTokenCheck) > TOKEN_CHECK_INTERVAL) {
    const tokens = await checkSlackTokens();
    
    if (!tokens.bot.valid) {
      issues.push({
        component: 'bot_token',
        error: tokens.bot.error || 'Invalid',
        action: 'notify'
      });
      log(`Bot token invalid: ${tokens.bot.error}`, 'error');
    } else {
      log(`Bot token valid (${tokens.bot.user})`, 'success');
    }
    
    if (process.env.SLACK_USER_TOKEN && !tokens.user.valid) {
      log(`User token invalid: ${tokens.user.error}`, 'warning');
    }
    
    state.lastTokenCheck = now;
  }
  
  // Handle issues
  if (issues.length > 0) {
    state.checks.failed++;
    state.issues = issues;
    state.status = 'unhealthy';
    
    // Auto-fix if enabled
    if (AUTO_RESTART_ENABLED) {
      for (const issue of issues) {
        if (issue.action === 'restart') {
          if (issue.component === 'server') {
            const fixed = await restartServer();
            if (fixed) {
              await sendNotification(
                'Slack Server Restarted',
                `The server was automatically restarted due to: ${issue.error}`,
                'default'
              );
            }
          } else if (issue.component === 'tunnel') {
            const fixed = await restartTunnel();
            if (fixed) {
              await sendNotification(
                'Cloudflare Tunnel Restarted',
                `The tunnel was automatically restarted due to: ${issue.error}`,
                'default'
              );
            }
          }
        } else if (issue.action === 'notify') {
          await sendNotification(
            'Slack Integration Issue',
            `Component ${issue.component} has an issue: ${issue.error}`,
            'high'
          );
        }
      }
    }
  } else {
    state.checks.successful++;
    state.issues = [];
    state.status = 'healthy';
  }
  
  state.lastCheck = Date.now();
}

// Status endpoint for external monitoring
async function startStatusServer() {
  const express = (await import('express')).default;
  const app = express();
  
  app.get('/status', (req, res) => {
    const uptime = Math.round((Date.now() - state.startTime) / 1000);
    const successRate = state.checks.total > 0 
      ? Math.round((state.checks.successful / state.checks.total) * 100)
      : 0;
    
    res.json({
      status: state.status,
      uptime,
      checks: state.checks,
      restarts: state.restarts,
      issues: state.issues,
      successRate: `${successRate}%`,
      lastCheck: state.lastCheck ? new Date(state.lastCheck).toISOString() : null
    });
  });
  
  const PORT = 8767;
  app.listen(PORT, () => {
    log(`Health monitor status available at http://localhost:${PORT}/status`, 'info');
  });
}

// Main monitoring loop
async function startMonitoring() {
  log('=================================', 'info');
  log('Slack Integration Health Monitor', 'info');
  log('=================================', 'info');
  log(`Check interval: ${MONITOR_INTERVAL / 1000}s`, 'info');
  log(`Token check interval: ${TOKEN_CHECK_INTERVAL / 60000}m`, 'info');
  log(`Auto-restart: ${AUTO_RESTART_ENABLED}`, 'info');
  log(`Log file: ${LOG_FILE}`, 'info');
  
  // Start status server
  await startStatusServer();
  
  // Initial check
  await performHealthCheck();
  
  // Set up monitoring interval
  setInterval(async () => {
    try {
      await performHealthCheck();
    } catch (error) {
      log(`Health check error: ${error.message}`, 'error');
    }
  }, MONITOR_INTERVAL);
  
  log('Monitoring started...', 'success');
}

// Graceful shutdown
process.on('SIGINT', () => {
  log('\nShutting down health monitor...', 'warning');
  
  const report = {
    uptime: Math.round((Date.now() - state.startTime) / 1000),
    totalChecks: state.checks.total,
    successful: state.checks.successful,
    failed: state.checks.failed,
    serverRestarts: state.restarts.server,
    tunnelRestarts: state.restarts.tunnel
  };
  
  log(`Final report:`, 'info');
  log(`  Uptime: ${report.uptime}s`, 'info');
  log(`  Checks: ${report.totalChecks} (${report.successful} successful, ${report.failed} failed)`, 'info');
  log(`  Restarts: ${report.serverRestarts} server, ${report.tunnelRestarts} tunnel`, 'info');
  
  process.exit(0);
});

// Error handling
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`, 'error');
  console.error(error);
});

process.on('unhandledRejection', (reason) => {
  log(`Unhandled rejection: ${reason}`, 'error');
  console.error(reason);
});

// Start monitoring
startMonitoring().catch(error => {
  log(`Failed to start monitoring: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});