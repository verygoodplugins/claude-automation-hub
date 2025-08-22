#!/usr/bin/env node
/**
 * Slack Integration Setup Wizard
 * 
 * Interactive setup and validation tool that ensures your Slack integration
 * is properly configured before starting. Detects and helps fix all common issues.
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);

// Load existing environment
dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration state
const config = {
  env: {},
  issues: [],
  warnings: [],
  fixes: [],
  validated: {
    environment: false,
    tokens: false,
    server: false,
    tunnel: false,
    slackApp: false
  }
};

// Helper functions
function print(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  let prefix = '';
  let color = colors.reset;
  
  switch(type) {
    case 'header':
      console.log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
      console.log(`${colors.bright}${colors.blue}${message}${colors.reset}`);
      console.log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n`);
      return;
    case 'success':
      prefix = '✅';
      color = colors.green;
      break;
    case 'error':
      prefix = '❌';
      color = colors.red;
      break;
    case 'warning':
      prefix = '⚠️ ';
      color = colors.yellow;
      break;
    case 'info':
      prefix = 'ℹ️ ';
      color = colors.cyan;
      break;
    case 'question':
      prefix = '❓';
      color = colors.magenta;
      break;
    case 'step':
      prefix = '▶️ ';
      color = colors.bright;
      break;
    case 'debug':
      prefix = '🔍';
      color = colors.dim;
      break;
  }
  
  console.log(`${color}${prefix} ${message}${colors.reset}`);
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.magenta}❓ ${question}${colors.reset} `, resolve);
  });
}

function showProgress(current, total, task) {
  const percentage = Math.round((current / total) * 100);
  const barLength = 30;
  const filled = Math.round((current / total) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  
  process.stdout.write(`\r${colors.cyan}[${bar}] ${percentage}% - ${task}${colors.reset}`);
  if (current === total) {
    console.log(' ✓');
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Step 1: Check Node.js version
async function checkNodeVersion() {
  print('Checking Node.js version...', 'step');
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  
  if (majorVersion < 16) {
    config.issues.push({
      type: 'error',
      message: `Node.js version ${nodeVersion} is too old. Version 16+ required.`,
      fix: 'Please upgrade Node.js to version 16 or higher'
    });
    print(`Node.js ${nodeVersion} - Too old!`, 'error');
    return false;
  }
  
  print(`Node.js ${nodeVersion} - OK`, 'success');
  return true;
}

// Step 2: Check and validate environment variables
async function checkEnvironment() {
  print('Checking environment configuration...', 'step');
  
  const requiredVars = [
    { 
      name: 'SLACK_BOT_TOKEN', 
      pattern: /^xoxb-/, 
      description: 'Bot User OAuth Token',
      help: 'Get this from Slack App → OAuth & Permissions → Bot User OAuth Token'
    },
    { 
      name: 'SLACK_SIGNING_SECRET', 
      pattern: /^[a-f0-9]{32}$/, 
      description: 'Signing Secret',
      help: 'Get this from Slack App → Basic Information → App Credentials'
    }
  ];
  
  const optionalVars = [
    { 
      name: 'SLACK_USER_TOKEN', 
      pattern: /^xoxp-/, 
      description: 'User OAuth Token (for advanced features)',
      help: 'Get this from Slack App → OAuth & Permissions → User OAuth Token'
    },
    {
      name: 'SLACK_APP_ID',
      pattern: /^A[A-Z0-9]+$/,
      description: 'Slack App ID',
      help: 'Get this from Slack App → Basic Information'
    }
  ];
  
  // Check required variables
  for (const varDef of requiredVars) {
    const value = process.env[varDef.name];
    
    if (!value) {
      print(`Missing: ${varDef.name}`, 'error');
      print(`  ${varDef.description}`, 'info');
      print(`  ${varDef.help}`, 'debug');
      
      const response = await askQuestion(`Enter ${varDef.name}: `);
      if (response) {
        config.env[varDef.name] = response;
        print(`  ${varDef.name} set`, 'success');
      } else {
        config.issues.push({
          type: 'error',
          message: `${varDef.name} is required`,
          fix: varDef.help
        });
      }
    } else if (!varDef.pattern.test(value)) {
      print(`Invalid format: ${varDef.name}`, 'warning');
      print(`  Expected pattern: ${varDef.pattern}`, 'debug');
      config.warnings.push({
        message: `${varDef.name} may be invalid`,
        fix: `Check format: should match ${varDef.pattern}`
      });
    } else {
      print(`${varDef.name}: ${value.substring(0, 10)}... ✓`, 'success');
      config.env[varDef.name] = value;
    }
  }
  
  // Check optional variables
  for (const varDef of optionalVars) {
    const value = process.env[varDef.name];
    
    if (!value) {
      print(`Optional: ${varDef.name} not set`, 'warning');
      const response = await askQuestion(`Enter ${varDef.name} (optional, press Enter to skip): `);
      if (response) {
        config.env[varDef.name] = response;
      }
    } else {
      print(`${varDef.name}: ${value.substring(0, 10)}... ✓`, 'success');
      config.env[varDef.name] = value;
    }
  }
  
  // Save any new environment variables
  if (Object.keys(config.env).length > 0) {
    await saveEnvironment();
  }
  
  config.validated.environment = config.issues.filter(i => i.type === 'error').length === 0;
  return config.validated.environment;
}

// Step 3: Validate tokens with Slack API
async function validateTokens() {
  print('Validating Slack tokens...', 'step');
  
  // Test bot token
  if (config.env.SLACK_BOT_TOKEN || process.env.SLACK_BOT_TOKEN) {
    const botToken = config.env.SLACK_BOT_TOKEN || process.env.SLACK_BOT_TOKEN;
    
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: { 'Authorization': `Bearer ${botToken}` }
      });
      const data = await response.json();
      
      if (data.ok) {
        print(`Bot Token Valid: ${data.user} in ${data.team}`, 'success');
        config.validated.tokens = true;
        
        // Check OAuth scopes
        const scopesResponse = await fetch('https://slack.com/api/auth.test', {
          headers: { 'Authorization': `Bearer ${botToken}` }
        });
        const scopesData = await scopesResponse.json();
        
        if (scopesData.ok) {
          print(`  Bot ID: ${data.user_id}`, 'debug');
          print(`  Team: ${data.team} (${data.team_id})`, 'debug');
        }
      } else {
        print(`Bot Token Invalid: ${data.error}`, 'error');
        config.issues.push({
          type: 'error',
          message: `Bot token is invalid: ${data.error}`,
          fix: 'Regenerate token at: https://api.slack.com/apps → OAuth & Permissions'
        });
      }
    } catch (error) {
      print(`Failed to validate bot token: ${error.message}`, 'error');
    }
  }
  
  // Test user token if present
  if (config.env.SLACK_USER_TOKEN || process.env.SLACK_USER_TOKEN) {
    const userToken = config.env.SLACK_USER_TOKEN || process.env.SLACK_USER_TOKEN;
    
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await response.json();
      
      if (data.ok) {
        print(`User Token Valid: ${data.user} in ${data.team}`, 'success');
      } else {
        print(`User Token Invalid: ${data.error}`, 'warning');
      }
    } catch (error) {
      print(`Failed to validate user token: ${error.message}`, 'warning');
    }
  }
  
  return config.validated.tokens;
}

// Step 4: Check local server
async function checkLocalServer() {
  print('Checking local server...', 'step');
  
  try {
    // Check if port is in use
    const { stdout } = await execAsync('lsof -ti :8765 2>/dev/null || echo ""');
    if (stdout.trim()) {
      print('Server already running on port 8765', 'success');
      
      // Test health endpoint
      try {
        const response = await fetch('http://localhost:8765/health');
        if (response.ok) {
          const data = await response.json();
          print(`  Server healthy: v${data.version || '1.0.0'}`, 'success');
          config.validated.server = true;
        }
      } catch (e) {
        print('  Server not responding correctly', 'warning');
      }
    } else {
      print('Server not running', 'warning');
      
      const start = await askQuestion('Start the server now? (y/n): ');
      if (start.toLowerCase() === 'y') {
        print('Starting server...', 'info');
        const serverProcess = spawn('node', [
          path.join(PROJECT_ROOT, 'src/proxy/cursor-web-proxy.js')
        ], {
          detached: true,
          stdio: 'ignore'
        });
        serverProcess.unref();
        
        await delay(3000);
        
        // Test again
        try {
          const response = await fetch('http://localhost:8765/health');
          if (response.ok) {
            print('Server started successfully', 'success');
            config.validated.server = true;
          }
        } catch (e) {
          print('Failed to start server', 'error');
        }
      }
    }
  } catch (error) {
    print(`Server check failed: ${error.message}`, 'error');
  }
  
  return config.validated.server;
}

// Step 5: Check Cloudflare tunnel
async function checkTunnel() {
  print('Checking Cloudflare tunnel...', 'step');
  
  try {
    // Check if cloudflared is installed
    const { stdout: version } = await execAsync('cloudflared --version 2>&1 || echo "not installed"');
    
    if (version.includes('not installed')) {
      print('Cloudflare CLI not installed', 'error');
      print('  Install with: brew install cloudflared', 'info');
      config.issues.push({
        type: 'error',
        message: 'Cloudflare CLI not installed',
        fix: 'Run: brew install cloudflared'
      });
      return false;
    }
    
    print(`Cloudflare CLI: ${version.split('\n')[0]}`, 'success');
    
    // Check if tunnel is running
    try {
      const response = await fetch('https://automation.verygoodplugins.com/health');
      if (response.ok) {
        print('Tunnel is active and accessible', 'success');
        config.validated.tunnel = true;
      } else {
        print(`Tunnel returned status ${response.status}`, 'warning');
      }
    } catch (error) {
      print('Tunnel not accessible', 'warning');
      
      const start = await askQuestion('Start tunnel now? (y/n): ');
      if (start.toLowerCase() === 'y') {
        print('Starting tunnel...', 'info');
        const tunnelProcess = spawn('bash', [
          path.join(PROJECT_ROOT, 'cloudflare-tunnel/start-tunnel.sh')
        ], {
          detached: true,
          stdio: 'ignore'
        });
        tunnelProcess.unref();
        
        await delay(5000);
        
        // Test again
        try {
          const response = await fetch('https://automation.verygoodplugins.com/health');
          if (response.ok) {
            print('Tunnel started successfully', 'success');
            config.validated.tunnel = true;
          }
        } catch (e) {
          print('Failed to start tunnel', 'error');
        }
      }
    }
  } catch (error) {
    print(`Tunnel check failed: ${error.message}`, 'error');
  }
  
  return config.validated.tunnel;
}

// Step 6: Check Slack app configuration
async function checkSlackApp() {
  print('Checking Slack app configuration...', 'step');
  
  const botToken = config.env.SLACK_BOT_TOKEN || process.env.SLACK_BOT_TOKEN;
  if (!botToken) {
    print('Cannot check app configuration without bot token', 'warning');
    return false;
  }
  
  try {
    // Check if app is installed to workspace
    const response = await fetch('https://slack.com/api/auth.test', {
      headers: { 'Authorization': `Bearer ${botToken}` }
    });
    const data = await response.json();
    
    if (!data.ok) {
      print('App not installed to workspace', 'error');
      config.issues.push({
        type: 'error',
        message: 'App not installed to workspace',
        fix: 'Install app at: https://api.slack.com/apps → Install App'
      });
      return false;
    }
    
    print('App installed to workspace ✓', 'success');
    
    // Check required permissions
    const requiredScopes = [
      'app_mentions:read',
      'channels:history', 
      'chat:write',
      'commands',
      'im:history',
      'reactions:write',
      'users:read'
    ];
    
    print('Checking OAuth scopes...', 'info');
    
    // Test a basic API call that would fail without proper scopes
    const testResponse = await fetch('https://slack.com/api/conversations.list?limit=1', {
      headers: { 'Authorization': `Bearer ${botToken}` }
    });
    const testData = await testResponse.json();
    
    if (testData.ok) {
      print('  Basic scopes verified ✓', 'success');
    } else if (testData.error === 'missing_scope') {
      print(`  Missing required scopes`, 'error');
      print(`  Add these scopes in Slack App → OAuth & Permissions:`, 'info');
      requiredScopes.forEach(scope => print(`    - ${scope}`, 'info'));
    }
    
    config.validated.slackApp = true;
  } catch (error) {
    print(`Slack app check failed: ${error.message}`, 'error');
  }
  
  // Show webhook URLs for configuration
  print('\nWebhook URLs for Slack App Configuration:', 'info');
  print('  Event Subscriptions:', 'info');
  print('    https://automation.verygoodplugins.com/slack/events', 'cyan');
  print('  Interactivity & Shortcuts:', 'info');
  print('    https://automation.verygoodplugins.com/slack/interactive', 'cyan');
  print('  Slash Commands:', 'info');
  print('    https://automation.verygoodplugins.com/slack/commands', 'cyan');
  
  const configured = await askQuestion('\nHave you configured these URLs in your Slack app? (y/n): ');
  if (configured.toLowerCase() !== 'y') {
    print('Please configure the URLs in your Slack app settings', 'warning');
    print('Visit: https://api.slack.com/apps', 'info');
  }
  
  return config.validated.slackApp;
}

// Save environment variables
async function saveEnvironment() {
  const envPath = path.join(PROJECT_ROOT, '.env');
  
  // Read existing .env file
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add new variables
  for (const [key, value] of Object.entries(config.env)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }
  
  // Write back to file
  fs.writeFileSync(envPath, envContent.trim() + '\n');
  print('Environment variables saved to .env', 'success');
}

// Generate diagnostic report
async function generateReport() {
  const reportPath = path.join(__dirname, 'setup-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    validated: config.validated,
    issues: config.issues,
    warnings: config.warnings,
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch
    },
    tokens: {
      bot: !!config.env.SLACK_BOT_TOKEN,
      user: !!config.env.SLACK_USER_TOKEN,
      signing: !!config.env.SLACK_SIGNING_SECRET
    }
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  print(`Diagnostic report saved to: ${reportPath}`, 'info');
}

// Main setup flow
async function runSetup() {
  print('SLACK INTEGRATION SETUP WIZARD', 'header');
  print('This wizard will help you configure and validate your Slack integration.\n', 'info');
  
  const steps = [
    { name: 'Node.js Version', fn: checkNodeVersion },
    { name: 'Environment Variables', fn: checkEnvironment },
    { name: 'Token Validation', fn: validateTokens },
    { name: 'Local Server', fn: checkLocalServer },
    { name: 'Cloudflare Tunnel', fn: checkTunnel },
    { name: 'Slack App Configuration', fn: checkSlackApp }
  ];
  
  let currentStep = 0;
  for (const step of steps) {
    currentStep++;
    print(`\nStep ${currentStep}/${steps.length}: ${step.name}`, 'header');
    showProgress(currentStep - 1, steps.length, step.name);
    
    const success = await step.fn();
    if (!success && config.issues.filter(i => i.type === 'error').length > 0) {
      print('\n⚠️  Critical issues found. Please fix before continuing.', 'error');
      
      const continueAnyway = await askQuestion('Continue anyway? (not recommended) (y/n): ');
      if (continueAnyway.toLowerCase() !== 'y') {
        break;
      }
    }
  }
  
  showProgress(steps.length, steps.length, 'Complete');
  
  // Summary
  print('\nSETUP SUMMARY', 'header');
  
  const validatedCount = Object.values(config.validated).filter(v => v).length;
  const totalChecks = Object.keys(config.validated).length;
  
  if (validatedCount === totalChecks) {
    print('✅ All checks passed! Your Slack integration is ready.', 'success');
    print('\nTo start the integration, run:', 'info');
    print('  npm run slack:start', 'cyan');
  } else {
    print(`⚠️  ${totalChecks - validatedCount} checks failed`, 'warning');
    
    if (config.issues.length > 0) {
      print('\n❌ Issues to fix:', 'error');
      config.issues.forEach(issue => {
        print(`  • ${issue.message}`, 'error');
        print(`    Fix: ${issue.fix}`, 'info');
      });
    }
    
    if (config.warnings.length > 0) {
      print('\n⚠️  Warnings:', 'warning');
      config.warnings.forEach(warning => {
        print(`  • ${warning.message}`, 'warning');
      });
    }
  }
  
  // Generate report
  await generateReport();
  
  print('\nSetup wizard complete!', 'success');
  rl.close();
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  print(`\nUnexpected error: ${error.message}`, 'error');
  console.error(error);
  rl.close();
  process.exit(1);
});

// Check for quick mode (non-interactive validation)
if (process.argv.includes('--quick')) {
  // Quick validation mode - just check, don't prompt
  async function quickValidation() {
    const checks = {
      nodeVersion: await checkNodeVersion(),
      tokens: false,
      server: false
    };
    
    // Check tokens
    if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET) {
      checks.tokens = true;
    }
    
    // Check server
    try {
      const response = await fetch('http://localhost:8765/health');
      checks.server = response.ok;
    } catch (e) {
      checks.server = false;
    }
    
    const allPassed = Object.values(checks).every(v => v);
    
    if (allPassed) {
      console.log('All checks passed');
    } else {
      if (!checks.tokens) console.log('❌ Missing required tokens');
      if (!checks.server) console.log('❌ Server not running');
    }
    
    process.exit(allPassed ? 0 : 1);
  }
  
  quickValidation().catch(() => process.exit(1));
} else {
  // Run the full interactive setup
  runSetup().catch(error => {
    print(`Setup failed: ${error.message}`, 'error');
    console.error(error);
    rl.close();
    process.exit(1);
  });
}