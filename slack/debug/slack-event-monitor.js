#!/usr/bin/env node
/**
 * Slack Event Monitor & Debugger
 * 
 * This script monitors all incoming Slack events, provides detailed logging,
 * and helps diagnose connectivity issues with slash commands and webhooks.
 */

import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.DEBUG_PORT || 8766;  // Different port for debug server

// Configuration
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const LOG_FILE = path.join(__dirname, 'slack-events.log');
const DETAILED_LOG_FILE = path.join(__dirname, 'slack-events-detailed.json');

// Middleware to capture raw body for signature verification
app.use(express.raw({ type: 'application/x-www-form-urlencoded' }));
app.use(express.raw({ type: 'application/json' }));

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Event statistics
const stats = {
  totalRequests: 0,
  challenges: 0,
  events: 0,
  commands: 0,
  interactive: 0,
  workflows: 0,
  errors: 0,
  signatureFailures: 0,
  lastEvent: null,
  startTime: Date.now()
};

// Store recent events for inspection
const recentEvents = [];
const MAX_RECENT_EVENTS = 50;

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Write to file
  fs.appendFileSync(LOG_FILE, logEntry);
  
  // Console output with colors
  let color = colors.reset;
  let prefix = '📝';
  
  switch(type) {
    case 'success': color = colors.green; prefix = '✅'; break;
    case 'error': color = colors.red; prefix = '❌'; break;
    case 'warning': color = colors.yellow; prefix = '⚠️'; break;
    case 'event': color = colors.cyan; prefix = '📥'; break;
    case 'command': color = colors.magenta; prefix = '🔧'; break;
    case 'debug': color = colors.blue; prefix = '🔍'; break;
  }
  
  console.log(`${color}${prefix} ${message}${colors.reset}`);
}

function logDetailed(eventData) {
  const entry = {
    timestamp: new Date().toISOString(),
    ...eventData
  };
  
  // Append to JSON log file
  let existingData = [];
  if (fs.existsSync(DETAILED_LOG_FILE)) {
    try {
      const content = fs.readFileSync(DETAILED_LOG_FILE, 'utf8');
      existingData = JSON.parse(content);
    } catch (e) {
      existingData = [];
    }
  }
  
  existingData.push(entry);
  
  // Keep only last 1000 events
  if (existingData.length > 1000) {
    existingData = existingData.slice(-1000);
  }
  
  fs.writeFileSync(DETAILED_LOG_FILE, JSON.stringify(existingData, null, 2));
  
  // Store in recent events
  recentEvents.push(entry);
  if (recentEvents.length > MAX_RECENT_EVENTS) {
    recentEvents.shift();
  }
}

function verifySlackSignature(req, body) {
  if (!SLACK_SIGNING_SECRET) {
    log('No signing secret configured - signature verification skipped', 'warning');
    return { valid: true, reason: 'No secret configured' };
  }
  
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  
  if (!signature || !timestamp) {
    return { valid: false, reason: 'Missing signature or timestamp headers' };
  }
  
  // Check timestamp (within 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
    return { valid: false, reason: 'Timestamp too old (replay attack protection)' };
  }
  
  // Create signature base string
  const sigBasestring = `v0:${timestamp}:${body}`;
  
  // Calculate expected signature
  const expectedSignature = 'v0=' + crypto
    .createHmac('sha256', SLACK_SIGNING_SECRET)
    .update(sigBasestring)
    .digest('hex');
  
  // Compare signatures
  const valid = signature === expectedSignature;
  
  return { 
    valid, 
    reason: valid ? 'Valid signature' : 'Invalid signature',
    expected: expectedSignature.substring(0, 20) + '...',
    received: signature.substring(0, 20) + '...'
  };
}

// Debug endpoint - shows current status
app.get('/status', (req, res) => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
  
  res.json({
    status: 'running',
    uptime: `${uptime} seconds`,
    stats,
    recentEvents: recentEvents.slice(-10),
    config: {
      signingSecretConfigured: !!SLACK_SIGNING_SECRET,
      port: PORT,
      logFile: LOG_FILE
    }
  });
});

// Universal handler for all Slack endpoints
function handleSlackRequest(endpoint) {
  return (req, res) => {
    stats.totalRequests++;
    
    // Get raw body
    const rawBody = req.body.toString('utf8');
    let parsedBody;
    
    try {
      // Parse body based on content type
      if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(rawBody);
        parsedBody = Object.fromEntries(params);
        
        // Parse payload if it exists (for interactive endpoints)
        if (parsedBody.payload) {
          parsedBody = JSON.parse(parsedBody.payload);
        }
      } else {
        parsedBody = JSON.parse(rawBody);
      }
    } catch (e) {
      log(`Failed to parse body: ${e.message}`, 'error');
      parsedBody = { parseError: e.message, rawBody: rawBody.substring(0, 500) };
    }
    
    // Verify signature
    const signatureCheck = verifySlackSignature(req, rawBody);
    if (!signatureCheck.valid) {
      stats.signatureFailures++;
      log(`Signature verification failed: ${signatureCheck.reason}`, 'error');
    }
    
    // Log the event
    const eventInfo = {
      endpoint,
      method: req.method,
      headers: {
        'x-slack-signature': req.headers['x-slack-signature']?.substring(0, 20) + '...',
        'x-slack-request-timestamp': req.headers['x-slack-request-timestamp'],
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']
      },
      signatureValid: signatureCheck.valid,
      signatureReason: signatureCheck.reason,
      body: parsedBody,
      rawBodyLength: rawBody.length
    };
    
    logDetailed(eventInfo);
    
    // Handle different types of requests
    if (parsedBody.challenge) {
      // URL verification challenge
      stats.challenges++;
      log(`Challenge received: ${parsedBody.challenge}`, 'success');
      return res.status(200).send(parsedBody.challenge);
    }
    
    if (parsedBody.command) {
      // Slash command
      stats.commands++;
      log(`Slash command: ${parsedBody.command} from @${parsedBody.user_name}: "${parsedBody.text}"`, 'command');
      
      // Log additional command details
      log(`  Channel: ${parsedBody.channel_name} (${parsedBody.channel_id})`, 'debug');
      log(`  User: ${parsedBody.user_name} (${parsedBody.user_id})`, 'debug');
      log(`  Team: ${parsedBody.team_domain} (${parsedBody.team_id})`, 'debug');
      log(`  Response URL: ${parsedBody.response_url}`, 'debug');
      
      // Respond to command
      return res.json({
        response_type: 'ephemeral',
        text: `Debug: Received command ${parsedBody.command} with text: "${parsedBody.text}"\nCheck debug logs for details.`
      });
    }
    
    if (parsedBody.event) {
      // Event API
      stats.events++;
      log(`Event: ${parsedBody.event.type} from ${parsedBody.event.user || 'system'}`, 'event');
      
      if (parsedBody.event.text) {
        log(`  Text: "${parsedBody.event.text.substring(0, 100)}..."`, 'debug');
      }
    }
    
    if (parsedBody.type === 'shortcut' || parsedBody.type === 'view_submission') {
      // Interactive component
      stats.interactive++;
      log(`Interactive: ${parsedBody.type} - ${parsedBody.callback_id || 'unknown'}`, 'event');
    }
    
    if (endpoint.includes('workflow')) {
      stats.workflows++;
      log(`Workflow event: ${parsedBody.callback_id || 'unknown'}`, 'event');
    }
    
    stats.lastEvent = new Date().toISOString();
    
    // Always respond quickly to Slack
    res.status(200).send('OK');
  };
}

// Set up all Slack endpoints
app.post('/slack/events', handleSlackRequest('/slack/events'));
app.post('/slack/commands', handleSlackRequest('/slack/commands'));
app.post('/slack/interactive', handleSlackRequest('/slack/interactive'));
app.post('/slack/workflow', handleSlackRequest('/slack/workflow'));
app.post('/slack/workflow/config', handleSlackRequest('/slack/workflow/config'));
app.post('/slack/workflow/execute', handleSlackRequest('/slack/workflow/execute'));

// Test endpoints
app.get('/slack/events', (req, res) => {
  res.json({ status: 'ready', message: 'POST events here' });
});

// Start server
app.listen(PORT, () => {
  log(`=================================`, 'success');
  log(`Slack Event Monitor Started`, 'success');
  log(`=================================`, 'success');
  log(`Port: ${PORT}`, 'info');
  log(`Log file: ${LOG_FILE}`, 'info');
  log(`Detailed log: ${DETAILED_LOG_FILE}`, 'info');
  log(`Status: http://localhost:${PORT}/status`, 'info');
  log(``, 'info');
  log(`Monitoring endpoints:`, 'info');
  log(`  POST http://localhost:${PORT}/slack/events`, 'info');
  log(`  POST http://localhost:${PORT}/slack/commands`, 'info');
  log(`  POST http://localhost:${PORT}/slack/interactive`, 'info');
  log(`  POST http://localhost:${PORT}/slack/workflow`, 'info');
  log(``, 'info');
  log(`Waiting for Slack events...`, 'info');
  log(`=================================`, 'success');
});

// Graceful shutdown
process.on('SIGINT', () => {
  log('\nShutting down monitor...', 'warning');
  log(`Total requests: ${stats.totalRequests}`, 'info');
  log(`Events: ${stats.events}, Commands: ${stats.commands}, Interactive: ${stats.interactive}`, 'info');
  process.exit(0);
});

// Error handling
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`, 'error');
  console.error(error);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled rejection: ${reason}`, 'error');
  console.error(reason);
});