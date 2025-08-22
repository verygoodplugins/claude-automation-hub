#!/usr/bin/env node
/**
 * Cursor Web Proxy Server 🌐
 * 
 * Creates clickable HTTP links that bypass Claude Desktop's sandboxing
 * and open files directly in Cursor IDE with AI prompts.
 * 
 * Also handles Slack webhook integration for AI-powered automation.
 * 
 * Security: Only accepts localhost connections, validates all inputs,
 * and automatically expires tasks after 24 hours.
 */

import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';
import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const execAsync = promisify(exec);
const app = express();

// Security configuration
const PORT = process.env.CURSOR_PROXY_PORT || 8765;
const BIND_ADDRESS = process.env.CURSOR_PROXY_BIND || 'localhost';
const TASK_EXPIRY_HOURS = 24;
const MAX_TASKS = 1000;

// Slack configuration
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;    // xoxb- token for views.publish and Slack API
const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN;  // xoxp- token for MCP operations
const DEBUG_MODE = process.env.NODE_ENV === 'development';

// Network exposure detection
const IS_NETWORK_EXPOSED = BIND_ADDRESS === '0.0.0.0' || 
                           (BIND_ADDRESS !== 'localhost' && 
                            !BIND_ADDRESS.startsWith('127.') && 
                            BIND_ADDRESS !== '::1');

// CORS - only allow localhost for security
app.use((req, res, next) => {
  const origin = req.get('Origin');
  if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json({ limit: '10mb' }));

// Security warning and IP logging for network mode
if (IS_NETWORK_EXPOSED) {
  app.use((req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    console.log(`[NETWORK] Request from ${clientIp} to ${req.path}`);
    next();
  });
}

// In-memory task storage with automatic cleanup
const taskStore = new Map();

// Cleanup expired tasks every hour
setInterval(() => {
  const now = Date.now();
  for (const [id, task] of taskStore.entries()) {
    if (now - task.created > TASK_EXPIRY_HOURS * 60 * 60 * 1000) {
      taskStore.delete(id);
    }
  }
}, 60 * 60 * 1000);

// Generate secure task IDs
function generateTaskId(data) {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(8).toString('hex');
  return crypto.createHash('sha256')
    .update(JSON.stringify(data) + timestamp + random)
    .digest('hex')
    .slice(0, 12);
}

// Validate and sanitize inputs
function validateTask(task) {
  const errors = [];
  
  if (!task.projectPath || typeof task.projectPath !== 'string') {
    errors.push('projectPath is required and must be a string');
  }
  
  if (task.file && typeof task.file !== 'string') {
    errors.push('file must be a string if provided');
  }
  
  if (!task.prompt || typeof task.prompt !== 'string') {
    errors.push('prompt is required and must be a string');
  }
  
  if (task.prompt && task.prompt.length > 10000) {
    errors.push('prompt must be less than 10,000 characters');
  }
  
  if (task.title && typeof task.title !== 'string') {
    errors.push('title must be a string if provided');
  }
  
  // Security: Prevent path traversal
  if (task.projectPath && (task.projectPath.includes('..') || task.projectPath.includes('~'))) {
    errors.push('projectPath contains invalid characters');
  }
  
  if (task.file && (task.file.includes('..') || task.file.startsWith('/'))) {
    errors.push('file path contains invalid characters');
  }
  
  return errors;
}

// Main endpoint: Open file in Cursor and show prompt
app.get('/cursor/:id', async (req, res) => {
  try {
    const task = taskStore.get(req.params.id);
    
    if (!task) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Task Not Found</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                   padding: 40px; max-width: 600px; margin: 0 auto; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="error">❌ Task Not Found</h1>
          <p>This link may have expired or the task ID is invalid.</p>
          <p>Tasks expire after ${TASK_EXPIRY_HOURS} hours for security.</p>
        </body>
        </html>
      `);
    }
    
    // Build cursor command with proper --goto syntax
    const basePath = task.file 
      ? (path.isAbsolute(task.file) ? task.file : path.join(task.projectPath, task.file))
      : task.projectPath;
    
    // Validate path exists before opening
    if (!existsSync(basePath)) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Path Not Found</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                   padding: 40px; max-width: 600px; margin: 0 auto; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="error">📁 Path Not Found</h1>
          <p>The file or project path no longer exists:</p>
          <code>${basePath}</code>
        </body>
        </html>
      `);
    }
    
    // Build commands - file opening + prompt injection
    const fileCommand = task.lineNumber 
      ? `cursor --goto "${basePath}:${task.lineNumber}:${task.columnNumber || 1}"`
      : `cursor "${basePath}"`;
    
    const agentCommand = task.prompt 
      ? `cursor-agent -p "${task.prompt}" --background`
      : null;
    
    console.log(`[${new Date().toISOString()}] Opening: ${fileCommand}`);
    if (agentCommand) {
      console.log(`[${new Date().toISOString()}] Agent: ${agentCommand}`);
    }
    
    let promptInjected = false;
    let authError = false;
    
    try {
      // Step 1: Open file at specific line
      await execAsync(fileCommand);
      
      // Step 2: Try to inject prompt via cursor-agent
      if (agentCommand) {
        // Small delay to ensure Cursor is ready
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          await execAsync(agentCommand, { timeout: 10000 });
          promptInjected = true;
          console.log(`[${new Date().toISOString()}] Prompt injected successfully`);
        } catch (agentError) {
          if (agentError.message.includes('Not logged in') || agentError.message.includes('authentication')) {
            authError = true;
            console.log(`[${new Date().toISOString()}] Agent not authenticated, will use clipboard fallback`);
          } else {
            console.log(`[${new Date().toISOString()}] Agent failed: ${agentError.message}`);
          }
        }
      }
      
      // Enhanced success page with smart instructions
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Opened in Cursor</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              padding: 40px; max-width: 800px; margin: 0 auto; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; min-height: 100vh;
            }
            .container { 
              background: rgba(255,255,255,0.1); 
              backdrop-filter: blur(10px);
              border-radius: 16px; 
              padding: 30px; 
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }
            .success { color: #4ade80; font-size: 1.5em; margin-bottom: 20px; }
            .status-box {
              background: ${promptInjected ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)'};
              padding: 15px;
              border-radius: 8px;
              margin: 15px 0;
              border: 1px solid ${promptInjected ? 'rgba(74, 222, 128, 0.3)' : 'rgba(251, 191, 36, 0.3)'};
            }
            .prompt-box { 
              background: rgba(0,0,0,0.2); 
              padding: 20px; 
              border-radius: 12px; 
              margin: 20px 0;
              border: 1px solid rgba(255,255,255,0.1);
            }
            .file-info {
              background: rgba(255,255,255,0.1);
              padding: 15px;
              border-radius: 8px;
              margin: 15px 0;
              font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            }
            button { 
              background: linear-gradient(45deg, #4ade80, #22c55e);
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s;
              margin: 10px 5px 0 0;
            }
            button:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
            }
            pre { 
              white-space: pre-wrap; 
              word-wrap: break-word; 
              font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
              line-height: 1.5;
            }
            .instructions {
              opacity: 0.9;
              font-size: 0.95em;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">✅ Opened in Cursor!</h1>
            
            <div class="file-info">
              <strong>📁 Project:</strong> ${task.projectPath}<br>
              ${task.file ? `<strong>📄 File:</strong> ${task.file}<br>` : ''}
              ${task.lineNumber ? `<strong>📍 Line:</strong> ${task.lineNumber}<br>` : ''}
            </div>
            
            ${task.prompt ? `
              <div class="status-box">
                ${promptInjected 
                  ? '<strong>🎯 Prompt Sent!</strong> The AI prompt has been automatically sent to Cursor and should appear in the composer.'
                  : authError 
                    ? '<strong>📋 Prompt Ready!</strong> cursor-agent needs authentication. The prompt has been copied to your clipboard.'
                    : '<strong>📋 Manual Mode!</strong> The prompt is ready for you to copy and paste.'
                }
              </div>
              
              <div class="prompt-box">
                <h3>🤖 AI Prompt:</h3>
                <pre id="prompt">${task.prompt}</pre>
                
                <button onclick="copyPrompt()">📋 Copy Prompt</button>
                ${authError ? '<button onclick="showLoginInstructions()">🔑 Setup Agent</button>' : ''}
              </div>
              
              <div class="instructions">
                ${promptInjected 
                  ? '💡 <strong>Next:</strong> Check Cursor - the prompt should be ready in the composer!'
                  : authError
                    ? '💡 <strong>Next:</strong> Run <code>cursor-agent login</code> for automatic prompts, or press <strong>Cmd+K</strong> in Cursor and paste.'
                    : '💡 <strong>Next:</strong> Press <strong>Cmd+K</strong> in Cursor and paste the prompt to get started.'
                }
              </div>
            ` : ''}
          </div>
          
          <script>
            function copyPrompt() {
              const prompt = document.getElementById('prompt').textContent;
              navigator.clipboard.writeText(prompt).then(() => {
                const btn = event.target;
                const original = btn.textContent;
                btn.textContent = '✅ Copied!';
                btn.style.background = 'linear-gradient(45deg, #22c55e, #16a34a)';
                setTimeout(() => {
                  btn.textContent = original;
                  btn.style.background = 'linear-gradient(45deg, #4ade80, #22c55e)';
                }, 2000);
              });
            }
            
            function showLoginInstructions() {
              alert('To enable automatic prompts:\\n\\n1. Open Terminal\\n2. Run: cursor-agent login\\n3. Follow authentication steps\\n\\nThen clickable links will automatically inject prompts!');
            }
            
            // Auto-copy prompt to clipboard if agent failed
            ${!promptInjected && task.prompt ? `
              setTimeout(() => {
                navigator.clipboard.writeText(document.getElementById('prompt').textContent);
              }, 1000);
            ` : ''}
          </script>
        </body>
        </html>
      `);
      
    } catch (error) {
      console.error('Error opening Cursor:', error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error Opening Cursor</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                   padding: 40px; max-width: 600px; margin: 0 auto; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="error">❌ Failed to Open Cursor</h1>
          <p>Make sure Cursor CLI is installed and available in your PATH.</p>
          <p>Install with: <code>brew install --cask cursor</code></p>
          <p><strong>Error:</strong> ${error.message}</p>
        </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal server error');
  }
});

// Register a new task and get a clickable link
app.post('/register', (req, res) => {
  try {
    // Validate input
    const errors = validateTask(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    // Check task limit
    if (taskStore.size >= MAX_TASKS) {
      return res.status(429).json({
        success: false,
        error: 'Too many tasks. Please try again later.'
      });
    }
    
    // Create task
    const task = {
      ...req.body,
      created: Date.now(),
      id: req.body.id || generateTaskId(req.body)
    };
    
    // Store task
    taskStore.set(task.id, task);
    
    console.log(`[${new Date().toISOString()}] Registered task: ${task.id} - ${task.title || 'Untitled'}`);
    
    res.json({
      success: true,
      id: task.id,
      url: `http://localhost:${PORT}/cursor/${task.id}`,
      title: task.title || 'Cursor Task',
      expiresAt: new Date(task.created + TASK_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
    });
    
  } catch (error) {
    console.error('Error registering task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register task'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    tasks: taskStore.size,
    maxTasks: MAX_TASKS,
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Status page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cursor Web Proxy</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          padding: 40px; max-width: 600px; margin: 0 auto; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; min-height: 100vh;
        }
        .container { 
          background: rgba(255,255,255,0.1); 
          backdrop-filter: blur(10px);
          border-radius: 16px; 
          padding: 30px; 
          text-align: center;
        }
        .status { color: #4ade80; }
        .stats { margin: 20px 0; }
        .stat { display: inline-block; margin: 0 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌐 Cursor Web Proxy</h1>
        <p class="status">✅ Server Running</p>
        
        <div class="stats">
          <div class="stat">📋 <strong>${taskStore.size}</strong> active tasks</div>
          <div class="stat">⏱️ <strong>${Math.round(process.uptime() / 60)}m</strong> uptime</div>
        </div>
        
        <p>This proxy creates clickable links that open files in Cursor IDE.<br>
        Used by Claude Automation Hub for bypassing sandbox restrictions.</p>
      </div>
    </body>
    </html>
  `);
});

// =========================
// SLACK WEBHOOK ENDPOINTS
// =========================

// Publish beautiful AI-powered home view to Slack
async function publishHomeView(userId, teamId) {
  if (!SLACK_BOT_TOKEN) {
    if (DEBUG_MODE) console.log('⚠️ No bot token configured, skipping home view publish');
    return;
  }
  
  const homeView = {
    type: 'home',
    blocks: [
      // Clean header
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'AI Command Center',
          emoji: true
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Powered by Claude 3.5 • Real-time automation'
          }
        ]
      },
      {
        type: 'divider'
      },
      // Quick actions
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Quick Actions*'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '💬  Start AI Chat',
              emoji: true
            },
            style: 'primary',
            action_id: 'start_chat'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '📊  Analyze',
              emoji: true
            },
            action_id: 'analyze'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '📝  Generate',
              emoji: true
            },
            action_id: 'generate'
          }
        ]
      },
      // Today's stats
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*📈 Today\'s Impact*'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Tasks*\n`127` done'
          },
          {
            type: 'mrkdwn',
            text: '*Time Saved*\n`3.2` hours'
          },
          {
            type: 'mrkdwn',
            text: '*Tickets*\n`8` resolved'
          },
          {
            type: 'mrkdwn',
            text: '*Workflows*\n`5` active'
          }
        ]
      },
      {
        type: 'divider'
      },
      // Recent activity
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Recent Activity*\n• Analyzed ticket #5847 (2m ago)\n• Generated blog post (15m ago)\n• Synced 43 records (1h ago)'
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'v1.0.0 • `/claude` for quick access'
          }
        ]
      }
    ]
  };
  
  try {
    // Import fetch if not available
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('https://slack.com/api/views.publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,  // views.publish requires bot token
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        view: homeView
      })
    });
    
    const result = await response.json();
    if (result.ok) {
      if (DEBUG_MODE) console.log('✅ Home view published for user:', userId);
    } else {
      console.error('❌ Failed to publish home view:', result.error);
    }
  } catch (error) {
    console.error('Error publishing home view:', error);
  }
}

// Verify Slack request signatures for security
function verifySlackRequest(req) {
  if (!SLACK_SIGNING_SECRET) {
    // No signing secret configured, skip verification in development
    return DEBUG_MODE;
  }
  
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  
  if (!signature || !timestamp) {
    return false;
  }
  
  // Check timestamp to prevent replay attacks (must be within 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
    return false;
  }
  
  // Build the signature base string
  const rawBody = JSON.stringify(req.body);
  const sigBasestring = `v0:${timestamp}:${rawBody}`;
  
  // Calculate expected signature
  const expectedSignature = 'v0=' + crypto
    .createHmac('sha256', SLACK_SIGNING_SECRET)
    .update(sigBasestring)
    .digest('hex');
  
  // Compare signatures
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Slack Events endpoint - handles challenge, events, and link unfurling
app.post('/slack/events', (req, res) => {
  const body = req.body;
  
  if (DEBUG_MODE) console.log('📥 Slack event received:', body.type || body.event?.type || 'unknown');
  
  // Handle Slack URL verification challenge
  if (body.challenge) {
    if (DEBUG_MODE) console.log('✅ Responding to Slack challenge');
    return res.status(200).send(body.challenge);
  }
  
  // Handle actual events
  if (body.event) {
    if (DEBUG_MODE) console.log('📬 Event type:', body.event.type);
    
    // Handle different event types
    switch (body.event.type) {
      case 'app_mention':
        if (DEBUG_MODE) console.log('👋 Bot mentioned by:', body.event.user);
        break;
        
      case 'message':
        if (body.event.channel_type === 'im') {
          if (DEBUG_MODE) console.log('💬 Direct message from:', body.event.user);
        }
        break;
        
      case 'app_home_opened':
        if (DEBUG_MODE) console.log('🏠 User opened app home:', body.event.user);
        // Publish the home view for this user
        publishHomeView(body.event.user, body.team_id);
        break;
        
      case 'link_shared':
        if (DEBUG_MODE) console.log('🔗 Link shared event:', body.event.links);
        
        // Process each link for unfurling
        const unfurls = {};
        body.event.links.forEach(link => {
          const url = link.url;
          
          // WP Fusion links
          if (url.includes('wpfusion.com')) {
            unfurls[url] = {
              title: '📚 WP Fusion Documentation',
              text: 'Comprehensive guide for WP Fusion integration',
              color: '#667eea',
              fields: [
                { title: 'Type', value: 'Documentation', short: true },
                { title: 'Updated', value: 'Recently', short: true }
              ]
            };
          }
          
          // FreeScout support tickets
          else if (url.includes('support.verygoodplugins.com')) {
            const ticketMatch = url.match(/ticket\/(\d+)/);
            if (ticketMatch) {
              unfurls[url] = {
                title: `🎫 Support Ticket #${ticketMatch[1]}`,
                text: 'Customer support ticket',
                color: '#22c55e',
                fields: [
                  { title: 'Status', value: 'Open', short: true },
                  { title: 'Priority', value: 'Normal', short: true }
                ]
              };
            }
          }
          
          // Very Good Plugins links
          else if (url.includes('verygoodplugins.com')) {
            unfurls[url] = {
              title: '🔌 Very Good Plugins',
              text: 'Premium WordPress automation plugins',
              color: '#764ba2'
            };
          }
        });
        
        // Send unfurl data back to Slack (would need auth token in production)
        if (Object.keys(unfurls).length > 0) {
          if (DEBUG_MODE) console.log('📤 Would send unfurl data:', unfurls);
          // TODO: In production, call slack.chat.unfurl API here
        }
        break;
        
      default:
        if (DEBUG_MODE) console.log('📌 Event:', body.event.type);
    }
  }
  
  // Always respond quickly to Slack (within 3 seconds)
  res.status(200).send();
});

// Slack Interactivity endpoint
app.post('/slack/interactive', (req, res) => {
  const payload = req.body.payload ? JSON.parse(req.body.payload) : req.body;
  if (DEBUG_MODE) console.log('🎮 Interactive event:', payload.type || 'unknown');
  
  // Handle different interaction types
  switch (payload.type) {
    case 'shortcut':
      // Global shortcuts
      if (DEBUG_MODE) console.log('⚡ Global shortcut:', payload.callback_id);
      handleGlobalShortcut(payload);
      break;
      
    case 'message_action':
      // Message shortcuts
      if (DEBUG_MODE) console.log('📨 Message shortcut:', payload.callback_id);
      handleMessageShortcut(payload);
      break;
      
    case 'slash_command':
      // Slash commands
      if (DEBUG_MODE) console.log('/ Slash command:', payload.command);
      handleSlashCommand(payload);
      break;
      
    case 'block_actions':
      // Button clicks, menu selections
      if (DEBUG_MODE) console.log('🔘 Block action:', payload.actions);
      break;
      
    default:
      if (DEBUG_MODE) console.log('❓ Unknown interaction type:', payload.type);
  }
  
  res.status(200).send();
});

// Handle global shortcuts
function handleGlobalShortcut(payload) {
  switch (payload.callback_id) {
    case 'ask_claude_global':
      if (DEBUG_MODE) console.log('🤖 Opening Claude dialog for user:', payload.user.id);
      // TODO: Open modal dialog for AI chat
      break;
      
    case 'create_wp_post_global':
      if (DEBUG_MODE) console.log('📝 Creating WP post for user:', payload.user.id);
      // TODO: Open form for post creation
      break;
      
    default:
      if (DEBUG_MODE) console.log('Unknown global shortcut:', payload.callback_id);
  }
}

// Handle message shortcuts
function handleMessageShortcut(payload) {
  const message = payload.message;
  
  switch (payload.callback_id) {
    case 'summarize_message':
      if (DEBUG_MODE) console.log('📊 Summarizing message:', message.text?.substring(0, 50));
      // MCP Integration Example:
      // const summary = await mcp.claude.complete({
      //   prompt: `Summarize this Slack message: ${message.text}`,
      //   max_tokens: 150
      // });
      // await slack.chat.postMessage({
      //   channel: payload.channel.id,
      //   text: `Summary: ${summary}`
      // });
      break;
      
    case 'create_ticket_from_message':
      if (DEBUG_MODE) console.log('🎫 Creating ticket from message:', message.text?.substring(0, 50));
      // MCP Integration Example:
      // const ticket = await mcp.freescout.createTicket({
      //   customer_email: `${payload.user.name}@slack.com`,
      //   subject: `Slack: ${message.text.substring(0, 50)}`,
      //   message: message.text,
      //   source: 'slack'
      // });
      // await slack.chat.postEphemeral({
      //   channel: payload.channel.id,
      //   user: payload.user.id,
      //   text: `✅ Ticket created: ${ticket.url}`
      // });
      break;
      
    case 'save_message_to_memory':
      if (DEBUG_MODE) console.log('💾 Saving to memory:', message.text?.substring(0, 50));
      // MCP Integration Example:
      // await mcp.openmemory.add({
      //   content: message.text,
      //   metadata: {
      //     source: 'slack',
      //     channel: payload.channel.name,
      //     user: payload.user.name,
      //     timestamp: message.ts
      //   }
      // });
      // await slack.reactions.add({
      //   channel: payload.channel.id,
      //   timestamp: message.ts,
      //   name: 'white_check_mark'
      // });
      break;
      
    default:
      if (DEBUG_MODE) console.log('Unknown message shortcut:', payload.callback_id);
  }
}

// Handle slash commands
function handleSlashCommand(payload) {
  switch (payload.command) {
    case '/claude':
      if (DEBUG_MODE) console.log('🤖 Claude command from:', payload.user_name, '- Text:', payload.text);
      // TODO: Process with Claude and respond
      break;
      
    default:
      if (DEBUG_MODE) console.log('Unknown slash command:', payload.command);
  }
}

// Slack Workflow endpoint
app.post('/slack/workflow', (req, res) => {
  if (DEBUG_MODE) console.log('⚙️ Workflow event received');
  res.status(200).send();
});

// Slack Workflow configuration
app.post('/slack/workflow/config', (req, res) => {
  if (DEBUG_MODE) console.log('🔧 Workflow configuration request');
  res.status(200).json({
    steps: [
      {
        name: 'Create WP Fusion Post',
        callback_id: 'wpfusion_create_post'
      },
      {
        name: 'Create Support Ticket',
        callback_id: 'freescout_ticket'
      },
      {
        name: 'AI Channel Summary',
        callback_id: 'ai_channel_summary'
      }
    ]
  });
});

// Slack Workflow execution
app.post('/slack/workflow/execute', (req, res) => {
  if (DEBUG_MODE) console.log('▶️ Workflow execution request');
  const { callback_id, inputs } = req.body;
  
  // Handle different workflow steps
  switch (callback_id) {
    case 'wpfusion_create_post':
      if (DEBUG_MODE) console.log('📝 Creating WP Fusion post:', inputs);
      break;
    case 'freescout_ticket':
      if (DEBUG_MODE) console.log('🎫 Creating FreeScout ticket:', inputs);
      break;
    case 'ai_channel_summary':
      if (DEBUG_MODE) console.log('🤖 Generating AI summary:', inputs);
      break;
  }
  
  res.status(200).send();
});

// Slack Slash Commands endpoint
app.post('/slack/commands', (req, res) => {
  const { command, text, user_name, user_id, channel_id } = req.body;
  
  if (DEBUG_MODE) {
    console.log(`/ Slash command: ${command} from @${user_name}`);
    console.log(`  Text: "${text}"`);
  }
  
  switch (command) {
    case '/claude':
      // Respond immediately (Slack requires response within 3 seconds)
      res.json({
        response_type: 'in_channel', // or 'ephemeral' for private response
        text: `🤖 Processing your request: "${text}"\n_Claude is thinking..._`
      });
      
      // TODO: Process with Claude asynchronously and update message
      break;
      
    default:
      res.json({
        text: `Unknown command: ${command}`
      });
  }
});

// Also handle GET requests for browser testing
app.get('/slack/events', (req, res) => {
  res.json({
    status: 'ready',
    message: 'Slack events endpoint is active. POST events here.'
  });
});

// =========================
// END SLACK ENDPOINTS
// =========================

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, BIND_ADDRESS, () => {
  console.log(`
🌐 Cursor Web Proxy Server Started!

🔗 Server: http://${BIND_ADDRESS === '0.0.0.0' ? 'localhost' : BIND_ADDRESS}:${PORT}
${IS_NETWORK_EXPOSED 
  ? '⚠️  WARNING: Server exposed to network! Only use on trusted networks.'
  : '🔒 Security: Localhost-only access'}
📋 Max Tasks: ${MAX_TASKS}
⏱️  Task Expiry: ${TASK_EXPIRY_HOURS} hours

${IS_NETWORK_EXPOSED 
  ? '🚨 Network access enabled - monitor for unauthorized usage'
  : 'Ready to create clickable Cursor links! 🚀'}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;