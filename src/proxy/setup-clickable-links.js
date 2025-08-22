#!/usr/bin/env node
/**
 * 🌐 Clickable Links Setup Wizard
 * 
 * Fun, interactive setup for the Cursor Web Proxy that creates
 * clickable links to bypass Claude Desktop sandboxing!
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import readline from 'readline';

const execAsync = promisify(exec);

// Colors and styling
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
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m'
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;
const bold = (text) => `${colors.bright}${text}${colors.reset}`;
const dim = (text) => `${colors.dim}${text}${colors.reset}`;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

// Animation helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function showSpinner(text, duration = 2000) {
  const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  
  const interval = setInterval(() => {
    process.stdout.write(`\r${c('cyan', spinners[i % spinners.length])} ${text}`);
    i++;
  }, 100);
  
  await delay(duration);
  clearInterval(interval);
  process.stdout.write(`\r${c('green', '✅')} ${text}\n`);
}

// Welcome screen
async function showWelcome() {
  console.clear();
  console.log(`
${c('bgBlue', '                                                     ')}
${c('bgBlue', '  🌐 CURSOR WEB PROXY SETUP WIZARD 🚀              ')}
${c('bgBlue', '                                                     ')}

${bold('Welcome to the magical world of clickable links!')}

${c('cyan', '✨ What this does:')}
  ${c('green', '🔗')} Creates ${bold('clickable HTTP links')} that open files in Cursor
  ${c('green', '🎯')} Bypasses Claude Desktop's sandbox restrictions  
  ${c('green', '📧')} Perfect for emails, dashboards, and automation
  ${c('green', '🔒')} Secure localhost-only server with task expiration

${c('yellow', '🎉 Perfect for:')}
  • Daily summary dashboards with "Fix in Cursor" buttons
  • Email automation with direct IDE links
  • Team sharing of specific code issues
  • Any workflow needing clickable file access

${dim('Press Enter to start the magical setup...')}
  `);
  
  await question('');
}

// Check dependencies
async function checkDependencies() {
  console.log(`\n${bold('🔍 Checking your system...')}\n`);
  
  const checks = [
    { name: 'Node.js', cmd: 'node --version', required: true },
    { name: 'npm', cmd: 'npm --version', required: true },
    { name: 'Cursor CLI', cmd: 'which cursor', required: true },
    { name: 'node-fetch', cmd: 'npm list node-fetch', required: false }
  ];
  
  const results = [];
  
  for (const check of checks) {
    try {
      await showSpinner(`Checking ${check.name}...`, 800);
      const { stdout } = await execAsync(check.cmd);
      results.push({
        ...check,
        success: true,
        version: stdout.trim()
      });
    } catch (error) {
      results.push({
        ...check,
        success: false,
        error: error.message
      });
    }
  }
  
  // Show results
  console.log(`\n${bold('📋 System Check Results:')}\n`);
  
  let allGood = true;
  for (const result of results) {
    if (result.success) {
      console.log(`  ${c('green', '✅')} ${result.name} ${c('dim', result.version.split('\n')[0])}`);
    } else {
      console.log(`  ${c('red', '❌')} ${result.name} ${c('red', 'NOT FOUND')}`);
      if (result.required) allGood = false;
    }
  }
  
  if (!allGood) {
    console.log(`\n${c('red', '🚨 Missing required dependencies!')}`);
    console.log(`\n${bold('Quick fixes:')}`);
    console.log(`  ${c('cyan', '📦')} Install Cursor CLI: ${c('white', 'brew install --cask cursor')}`);
    console.log(`  ${c('cyan', '🔧')} Or download from: ${c('white', 'https://cursor.sh')}`);
    process.exit(1);
  }
  
  // Install node-fetch if missing
  const nodeFetchResult = results.find(r => r.name === 'node-fetch');
  if (!nodeFetchResult.success) {
    console.log(`\n${c('yellow', '📦 Installing node-fetch...')}`);
    await showSpinner('Installing dependencies...', 3000);
    try {
      await execAsync('npm install node-fetch');
      console.log(`${c('green', '✅')} node-fetch installed successfully!`);
    } catch (error) {
      console.log(`${c('red', '❌')} Failed to install node-fetch: ${error.message}`);
      console.log(`${c('yellow', '💡')} Please run: npm install node-fetch`);
    }
  }
  
  await delay(1000);
}

// Configure environment
async function configureEnvironment() {
  console.log(`\n${bold('⚙️  Environment Configuration')}\n`);
  
  const envPath = '.env';
  let envContent = '';
  
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf8');
    console.log(`${c('green', '✅')} Found existing .env file`);
  } else {
    console.log(`${c('yellow', '📝')} Creating new .env file...`);
    if (existsSync('.env.example')) {
      envContent = readFileSync('.env.example', 'utf8');
    }
  }
  
  // Configure proxy port
  const currentPort = envContent.match(/CURSOR_PROXY_PORT=(.+)/)?.[1] || '8765';
  
  console.log(`\n${c('cyan', '🌐 Web Proxy Configuration:')}`);
  console.log(`Current port: ${c('white', currentPort)}`);
  
  const newPort = await question(`\n🔢 Web proxy port (Enter for ${currentPort}): `);
  const finalPort = newPort.trim() || currentPort;
  
  // Update or add port to env
  if (envContent.includes('CURSOR_PROXY_PORT=')) {
    envContent = envContent.replace(/CURSOR_PROXY_PORT=.+/, `CURSOR_PROXY_PORT=${finalPort}`);
  } else {
    envContent += `\n# Cursor Web Proxy\nCURSOR_PROXY_PORT=${finalPort}\n`;
  }
  
  writeFileSync(envPath, envContent);
  
  console.log(`${c('green', '✅')} Environment configured!`);
  console.log(`${c('dim', '    Proxy will run on:')} ${c('white', `http://localhost:${finalPort}`)}`);
  
  return finalPort;
}

// Update package.json
async function updatePackageJson() {
  console.log(`\n${bold('📦 Updating package.json scripts...')}`);
  
  try {
    const packagePath = 'package.json';
    let packageJson;
    
    if (existsSync(packagePath)) {
      packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    } else {
      packageJson = {
        name: 'claude-automation-hub',
        version: '1.0.0',
        type: 'module',
        scripts: {}
      };
    }
    
    // Add proxy scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'proxy': 'node src/proxy/cursor-web-proxy.js',
      'proxy:dev': 'node --watch src/proxy/cursor-web-proxy.js',
      'proxy:start': 'npm run proxy',
      'setup:links': 'node src/proxy/setup-clickable-links.js'
    };
    
    // Add dependencies if not present
    if (!packageJson.dependencies) packageJson.dependencies = {};
    if (!packageJson.dependencies['node-fetch']) {
      packageJson.dependencies['node-fetch'] = '^3.3.2';
    }
    if (!packageJson.dependencies['express']) {
      packageJson.dependencies['express'] = '^4.18.2';
    }
    
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    
    await showSpinner('Updating package.json...', 1000);
    console.log(`${c('green', '✅')} Package.json updated with proxy scripts!`);
    
  } catch (error) {
    console.log(`${c('red', '❌')} Failed to update package.json: ${error.message}`);
  }
}

// Test the setup
async function testSetup() {
  console.log(`\n${bold('🧪 Testing the setup...')}`);
  
  // Start proxy in background
  console.log(`\n${c('cyan', '🚀 Starting web proxy...')}`);
  
  const { spawn } = await import('child_process');
  const proxy = spawn('node', ['src/proxy/cursor-web-proxy.js'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  });
  
  await delay(2000);
  
  // Test if proxy is running
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('http://localhost:8765/health');
    const health = await response.json();
    
    console.log(`${c('green', '✅')} Web proxy is running!`);
    console.log(`${c('dim', '    Status:')} ${c('white', health.status)}`);
    console.log(`${c('dim', '    URL:')} ${c('white', 'http://localhost:8765')}`);
    
    // Test link generation
    await showSpinner('Testing link generation...', 1500);
    
    const testResponse = await fetch('http://localhost:8765/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectPath: process.cwd(),
        file: 'README.md',
        prompt: 'This is a test prompt for the clickable links demo!',
        title: '🧪 Test Link'
      })
    });
    
    const testResult = await testResponse.json();
    
    console.log(`${c('green', '✅')} Link generation working!`);
    console.log(`\n${c('bgGreen', '  ✅ SUCCESS! Here is your first clickable link:  ')}`);
    console.log(`\n  ${c('cyan', '🔗 Test Link:')} ${c('white', testResult.url)}`);
    console.log(`  ${c('dim', '└─ Try clicking this link to open README.md in Cursor!')}`);
    
    // Kill proxy
    proxy.kill();
    
  } catch (error) {
    console.log(`${c('red', '❌')} Test failed: ${error.message}`);
    proxy.kill();
    return false;
  }
  
  return true;
}

// Show completion
async function showCompletion() {
  console.log(`\n${c('bgGreen', '                                        ')}`);
  console.log(`${c('bgGreen', '  🎉 SETUP COMPLETE! 🚀                ')}`);
  console.log(`${c('bgGreen', '                                        ')}`);
  
  console.log(`\n${bold('🌟 What you can do now:')}`);
  console.log(`\n${c('cyan', '1. Start the web proxy:')}`);
  console.log(`   ${c('white', 'npm run proxy')}`);
  
  console.log(`\n${c('cyan', '2. Generate clickable links in Claude:')}`);
  console.log(`   ${c('white', 'Use cursor_cli_deeplink with action: "generate_link"')}`);
  
  console.log(`\n${c('cyan', '3. Example daily dashboard:')}`);
  console.log(`   ${c('white', '"Generate my daily summary with Cursor deeplinks for all code tasks"')}`);
  
  console.log(`\n${c('yellow', '📚 Quick commands:')}`);
  console.log(`   ${c('dim', '🚀 Start proxy:')} ${c('white', 'npm run proxy')}`);
  console.log(`   ${c('dim', '🔄 Dev mode:')} ${c('white', 'npm run proxy:dev')}`);
  console.log(`   ${c('dim', '🏥 Health check:')} ${c('white', 'curl http://localhost:8765/health')}`);
  console.log(`   ${c('dim', '🌐 Status page:')} ${c('white', 'open http://localhost:8765')}`);
  
  console.log(`\n${c('green', '💡 Pro tip:')} Keep the proxy running in a separate terminal for instant clickable links!`);
  
  console.log(`\n${dim('Happy automating! 🤖✨')}`);
}

// Main setup flow
async function main() {
  try {
    await showWelcome();
    await checkDependencies();
    const port = await configureEnvironment();
    await updatePackageJson();
    
    const testSuccess = await testSetup();
    
    if (testSuccess) {
      await showCompletion();
    } else {
      console.log(`\n${c('yellow', '⚠️  Setup completed but testing failed.')}`);
      console.log(`${c('cyan', '💡 Try running:')} ${c('white', 'npm run proxy')} ${c('cyan', 'manually')}`);
    }
    
  } catch (error) {
    console.log(`\n${c('red', '❌ Setup failed:')} ${error.message}`);
    console.log(`\n${c('cyan', '🆘 Need help? Check:')} ${c('white', 'SECURITY.md')} ${c('cyan', 'or')} ${c('white', 'README.md')}`);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;