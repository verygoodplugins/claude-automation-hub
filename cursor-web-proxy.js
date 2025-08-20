#!/usr/bin/env node
/**
 * Cursor Web Proxy Server 🌐
 * 
 * Creates clickable HTTP links that bypass Claude Desktop's sandboxing
 * and open files directly in Cursor IDE with AI prompts.
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

const execAsync = promisify(exec);
const app = express();

// Security configuration
const PORT = process.env.CURSOR_PROXY_PORT || 8765;
const TASK_EXPIRY_HOURS = 24;
const MAX_TASKS = 1000;

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

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, 'localhost', () => {
  console.log(`
🌐 Cursor Web Proxy Server Started!

🔗 Server: http://localhost:${PORT}
🔒 Security: Localhost-only access
📋 Max Tasks: ${MAX_TASKS}
⏱️  Task Expiry: ${TASK_EXPIRY_HOURS} hours

Ready to create clickable Cursor links! 🚀
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