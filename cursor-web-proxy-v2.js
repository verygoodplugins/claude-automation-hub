#!/usr/bin/env node
/**
 * Cursor Web Proxy Server v2 🌐
 * 
 * Enhanced version that:
 * - Serves its own dashboard (no CORS issues)
 * - Works with MCPs to generate instant links
 * - Supports email and universal contexts
 * - Handles prompts elegantly
 */

import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';
import { existsSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const app = express();

const PORT = process.env.CURSOR_PROXY_PORT || 8765;
const TASK_EXPIRY_HOURS = 24;
const MAX_TASKS = 1000;

// Enhanced CORS - support file://, emails, and everything
app.use((req, res, next) => {
  // Allow all origins for maximum compatibility
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));

// Task storage
const taskStore = new Map();

// Cleanup expired tasks
setInterval(() => {
  const now = Date.now();
  for (const [id, task] of taskStore.entries()) {
    if (now - task.created > TASK_EXPIRY_HOURS * 60 * 60 * 1000) {
      taskStore.delete(id);
    }
  }
}, 60 * 60 * 1000);

// Generate short, memorable task IDs
function generateTaskId(data) {
  const hash = crypto.createHash('sha256')
    .update(JSON.stringify(data) + Date.now())
    .digest('hex');
  // Use first 8 chars for shorter URLs
  return hash.slice(0, 8);
}

// Main endpoint: Open in Cursor (GET for email compatibility)
app.get('/cursor/:id', async (req, res) => {
  try {
    const task = taskStore.get(req.params.id);
    
    if (!task) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Task Not Found</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, system-ui, sans-serif; 
              display: flex; align-items: center; justify-content: center;
              min-height: 100vh; margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white; padding: 40px; border-radius: 16px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center; max-width: 500px;
            }
            h1 { color: #dc3545; }
            p { color: #666; margin: 20px 0; }
            a { 
              color: #667eea; text-decoration: none; font-weight: 600;
              padding: 10px 20px; border: 2px solid #667eea;
              border-radius: 8px; display: inline-block; margin-top: 10px;
            }
            a:hover { background: #667eea; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Task Not Found</h1>
            <p>This link may have expired or the task ID is invalid.</p>
            <p>Tasks expire after ${TASK_EXPIRY_HOURS} hours for security.</p>
            <a href="http://localhost:${PORT}/dashboard">View Dashboard</a>
          </div>
        </body>
        </html>
      `);
    }
    
    // Build cursor command
    let targetPath = task.projectPath;
    if (task.file) {
      targetPath = path.isAbsolute(task.file) 
        ? task.file 
        : path.join(task.projectPath, task.file);
    }
    
    if (task.lineNumber) {
      targetPath += `:${task.lineNumber}:${task.columnNumber || 1}`;
    }
    
    // Validate path exists
    const basePath = targetPath.split(':')[0];
    if (!existsSync(basePath)) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Path Not Found</title>
          <style>
            body { 
              font-family: -apple-system, system-ui, sans-serif;
              display: flex; align-items: center; justify-content: center;
              min-height: 100vh; margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white; padding: 40px; border-radius: 16px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center; max-width: 500px;
            }
            h1 { color: #dc3545; }
            code { 
              background: #f4f4f4; padding: 10px; border-radius: 4px;
              display: block; margin: 20px 0; word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📁 Path Not Found</h1>
            <p>The file or project no longer exists:</p>
            <code>${basePath}</code>
          </div>
        </body>
        </html>
      `);
    }
    
    // Execute cursor command
    const command = `cursor "${targetPath}"`;
    console.log(`[${new Date().toISOString()}] Opening: ${command}`);
    
    try {
      await execAsync(command);
      
      // Success page with auto-close
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Opening in Cursor...</title>
          <meta charset="utf-8">
          <meta http-equiv="refresh" content="3;url=http://localhost:${PORT}/dashboard">
          <style>
            body { 
              font-family: -apple-system, system-ui, sans-serif;
              display: flex; align-items: center; justify-content: center;
              min-height: 100vh; margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: rgba(255,255,255,0.95);
              backdrop-filter: blur(10px);
              padding: 40px; border-radius: 16px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center; max-width: 600px;
            }
            h1 { color: #4ade80; margin-bottom: 20px; }
            .prompt-box {
              background: rgba(0,0,0,0.05);
              padding: 20px; border-radius: 12px;
              margin: 20px 0; text-align: left;
            }
            .prompt-box h3 { color: #333; margin-top: 0; }
            pre { 
              white-space: pre-wrap; word-wrap: break-word;
              color: #555; line-height: 1.5;
            }
            button {
              background: linear-gradient(45deg, #4ade80, #22c55e);
              color: white; border: none; padding: 12px 24px;
              border-radius: 8px; cursor: pointer;
              font-weight: 600; margin: 10px;
            }
            button:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
            }
            .meta {
              color: #666; font-size: 0.9em;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Opened in Cursor!</h1>
            
            <div class="meta">
              📁 ${task.projectPath}<br>
              ${task.file ? `📄 ${task.file}` : ''}
              ${task.lineNumber ? `<br>📍 Line ${task.lineNumber}` : ''}
            </div>
            
            ${task.prompt ? `
              <div class="prompt-box">
                <h3>🤖 AI Prompt:</h3>
                <pre id="prompt">${task.prompt}</pre>
                <button onclick="copyPrompt()">📋 Copy Prompt</button>
              </div>
            ` : ''}
            
            <p style="color: #666; margin-top: 20px;">
              Redirecting to dashboard in 3 seconds...
            </p>
          </div>
          
          <script>
            function copyPrompt() {
              const prompt = document.getElementById('prompt').textContent;
              navigator.clipboard.writeText(prompt).then(() => {
                event.target.textContent = '✅ Copied!';
                setTimeout(() => {
                  event.target.textContent = '📋 Copy Prompt';
                }, 2000);
              });
            }
            
            // Auto-close after 10 seconds
            setTimeout(() => window.close(), 10000);
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
          <title>Error</title>
          <style>
            body {
              font-family: -apple-system, system-ui, sans-serif;
              display: flex; align-items: center; justify-content: center;
              min-height: 100vh; margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white; padding: 40px; border-radius: 16px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center; max-width: 500px;
            }
            h1 { color: #dc3545; }
            pre {
              background: #f4f4f4; padding: 15px; border-radius: 8px;
              text-align: left; overflow-x: auto;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Failed to Open Cursor</h1>
            <p>Make sure Cursor CLI is installed:</p>
            <pre>brew install --cask cursor</pre>
            <p><strong>Error:</strong> ${error.message}</p>
          </div>
        </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal server error');
  }
});

// Register endpoint - returns immediately usable link
app.post('/register', (req, res) => {
  try {
    const task = {
      ...req.body,
      created: Date.now(),
      id: req.body.id || generateTaskId(req.body)
    };
    
    // Store task
    taskStore.set(task.id, task);
    
    const url = `http://localhost:${PORT}/cursor/${task.id}`;
    
    console.log(`[${new Date().toISOString()}] Registered: ${task.id} - ${task.title || 'Untitled'}`);
    
    res.json({
      success: true,
      id: task.id,
      url,
      markdown: `[${task.title || 'Open in Cursor'}](${url})`,
      html: `<a href="${url}">${task.title || 'Open in Cursor'}</a>`,
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

// Serve dashboard at /dashboard
app.get('/dashboard', (req, res) => {
  const tasks = Array.from(taskStore.values()).sort((a, b) => b.created - a.created);
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cursor Web Proxy Dashboard</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, system-ui, sans-serif;
          margin: 0; padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .container {
          max-width: 1200px; margin: 0 auto;
          background: rgba(255,255,255,0.95);
          border-radius: 16px; padding: 30px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
          color: #333; border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }
        .stats {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px; margin: 30px 0;
        }
        .stat {
          background: white; padding: 20px; border-radius: 12px;
          text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-number {
          font-size: 2em; font-weight: bold; color: #667eea;
        }
        .stat-label {
          color: #666; margin-top: 5px;
        }
        .task-list {
          margin-top: 30px;
        }
        .task {
          background: white; border-radius: 12px; padding: 20px;
          margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        .task:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .task-header {
          display: flex; justify-content: space-between;
          align-items: start; margin-bottom: 10px;
        }
        .task-title {
          font-size: 1.1em; font-weight: 600; color: #333;
        }
        .task-time {
          color: #999; font-size: 0.9em;
        }
        .task-details {
          color: #666; margin: 10px 0;
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 0.9em;
        }
        .task-link {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; text-decoration: none;
          padding: 8px 16px; border-radius: 6px;
          font-weight: 600; transition: transform 0.2s;
        }
        .task-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102,126,234,0.4);
        }
        .empty {
          text-align: center; color: #666; padding: 40px;
        }
        .refresh {
          float: right; color: #667eea; text-decoration: none;
          padding: 8px 16px; border: 2px solid #667eea;
          border-radius: 8px; font-weight: 600;
        }
        .refresh:hover {
          background: #667eea; color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>
          🌐 Cursor Web Proxy Dashboard
          <a href="/dashboard" class="refresh">🔄 Refresh</a>
        </h1>
        
        <div class="stats">
          <div class="stat">
            <div class="stat-number">${tasks.length}</div>
            <div class="stat-label">Active Tasks</div>
          </div>
          <div class="stat">
            <div class="stat-number">${MAX_TASKS - tasks.length}</div>
            <div class="stat-label">Available Slots</div>
          </div>
          <div class="stat">
            <div class="stat-number">${Math.round(process.uptime() / 60)}</div>
            <div class="stat-label">Minutes Uptime</div>
          </div>
          <div class="stat">
            <div class="stat-number">${TASK_EXPIRY_HOURS}h</div>
            <div class="stat-label">Task Expiry</div>
          </div>
        </div>
        
        <div class="task-list">
          <h2>📋 Recent Tasks</h2>
          ${tasks.length === 0 
            ? '<div class="empty">No active tasks. Tasks will appear here when registered via MCP or API.</div>'
            : tasks.slice(0, 50).map(task => `
                <div class="task">
                  <div class="task-header">
                    <div class="task-title">${task.title || 'Untitled Task'}</div>
                    <div class="task-time">${new Date(task.created).toLocaleString()}</div>
                  </div>
                  <div class="task-details">
                    📁 ${task.projectPath}<br>
                    ${task.file ? `📄 ${task.file}` : ''}
                    ${task.lineNumber ? `📍 Line ${task.lineNumber}` : ''}
                  </div>
                  <a href="/cursor/${task.id}" class="task-link" target="_blank">
                    Open in Cursor →
                  </a>
                </div>
              `).join('')
          }
        </div>
      </div>
      
      <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
      </script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    tasks: taskStore.size,
    maxTasks: MAX_TASKS,
    uptime: process.uptime(),
    version: '2.0.0',
    dashboardUrl: `http://localhost:${PORT}/dashboard`
  });
});

// Home page
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🌐 Cursor Web Proxy v2 Started!

🔗 Dashboard: http://localhost:${PORT}/dashboard
📡 API: http://localhost:${PORT}/register
🔒 Max Tasks: ${MAX_TASKS}
⏱️  Task Expiry: ${TASK_EXPIRY_HOURS} hours

✨ Features:
- No CORS issues (serves own dashboard)
- Email-compatible links
- MCP integration ready
- Universal links that work everywhere

Ready to create clickable Cursor links! 🚀
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

export default app;
