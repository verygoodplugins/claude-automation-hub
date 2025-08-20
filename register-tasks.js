#!/usr/bin/env node
/**
 * Register all AI Integration tasks with the Cursor Web Proxy
 * Run this to get clickable links for all your tasks!
 */

import fetch from 'node-fetch';

const PROXY_URL = 'http://127.0.0.1:8765';

// Task definitions
const tasks = [
  {
    id: 'claude-automation-hub-env',
    projectPath: '/Users/jgarturo/Projects/OpenAI/claude-automation-hub',
    file: 'README.md',
    title: '📝 Claude Hub .env Documentation',
    prompt: `Add a comprehensive section about .env file setup and security best practices. Include:
1. Clear explanation of what .env files are and why they're needed
2. Step-by-step setup instructions from .env.template
3. Security best practices (never commit .env, use .gitignore, rotate keys)
4. Example .env structure with dummy values
5. Common troubleshooting tips
Make it beginner-friendly with clear formatting and examples.`
  },
  {
    id: 'stormlight-refactor',
    projectPath: '/Users/jgarturo/Projects/OpenAI/stormlight_short',
    file: 'MULTI_PROJECT_REFACTOR_PLAN.md',
    title: '🎬 Stormlight Multi-Project Architecture',
    prompt: `Implement the multi-project architecture as outlined in this refactor plan. Focus on:
1. Creating project isolation with separate config files
2. Shared resource management for common assets
3. Configuration system updates to support multiple projects
4. Migration path for existing project data`
  },
  {
    id: 'stormlight-veo3',
    projectPath: '/Users/jgarturo/Projects/OpenAI/stormlight_short',
    file: 'studio.py',
    title: '🎥 Veo3 Prompt Optimization',
    prompt: `Update Veo3 video generation prompts based on recommendations from https://x.com/minchoi/status/1947141905910771855.
Implement: specific camera movements, detailed lighting, vertex limitation workarounds, temporal consistency.`
  },
  {
    id: 'mcp-reloader',
    projectPath: '/Users/jgarturo/Projects/OpenAI',
    title: '🔄 MCP Auto-Reloader Setup',
    prompt: `Set up https://github.com/mizchi/mcp-reloader for auto-reloading MCP servers during development.
Clone repo, configure for current setup, create dev workflow, add npm scripts.`
  },
  {
    id: 'freescout-github',
    projectPath: '/Users/jgarturo/Projects/OpenAI/freescout-github',
    title: '🎫 FreeScout-GitHub Integration',
    prompt: 'Review and enhance the FreeScout-GitHub integration for better ticket-to-PR workflow.'
  }
];

async function registerTasks() {
  console.log('🚀 Registering tasks with Cursor Web Proxy...\n');
  
  // Check if proxy is running
  try {
    const health = await fetch(`${PROXY_URL}/health`);
    const status = await health.json();
    console.log(`✅ Proxy is running (${status.tasks} tasks registered)\n`);
  } catch (error) {
    console.error('❌ Proxy is not running! Start it with: npm run proxy\n');
    process.exit(1);
  }
  
  // Register each task
  console.log('📋 Your Cursor Deep Links:\n');
  console.log('─'.repeat(80));
  
  for (const task of tasks) {
    try {
      const response = await fetch(`${PROXY_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`\n${task.title}`);
        console.log(`📍 ${result.url}`);
        console.log(`   └─ Opens: ${task.file || task.projectPath}`);
      } else {
        console.log(`\n❌ Failed to register: ${task.title}`);
      }
    } catch (error) {
      console.log(`\n❌ Error registering ${task.title}: ${error.message}`);
    }
  }
  
  console.log('\n' + '─'.repeat(80));
  console.log('\n✨ All tasks registered! Click any link above to open in Cursor.\n');
  console.log('💡 Tip: These links work in browsers, emails, and anywhere that renders HTML.');
  console.log('⏱️  Links expire after 24 hours for security.\n');
}

// Run it!
registerTasks().catch(console.error);
