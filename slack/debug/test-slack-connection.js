#!/usr/bin/env node
/**
 * Slack Connection Tester
 * 
 * Tests various aspects of your Slack integration to diagnose issues
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const LOCAL_SERVER = 'http://localhost:8765';
const PUBLIC_URL = 'https://automation.verygoodplugins.com';

// Test results
const results = {
  tokens: {},
  localServer: {},
  publicUrl: {},
  slackApi: {},
  webhooks: {}
};

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function print(message, status = 'info') {
  let color = colors.reset;
  let symbol = '•';
  
  switch(status) {
    case 'success': color = colors.green; symbol = '✅'; break;
    case 'error': color = colors.red; symbol = '❌'; break;
    case 'warning': color = colors.yellow; symbol = '⚠️'; break;
    case 'info': color = colors.cyan; symbol = 'ℹ️'; break;
    case 'header': color = colors.bright + colors.blue; symbol = '🔍'; break;
  }
  
  console.log(`${color}${symbol} ${message}${colors.reset}`);
}

async function testTokens() {
  print('\nTesting Slack Tokens', 'header');
  
  // Check if tokens exist
  if (!SLACK_BOT_TOKEN) {
    print('SLACK_BOT_TOKEN not configured', 'error');
    results.tokens.botToken = false;
  } else {
    print(`Bot token found: ${SLACK_BOT_TOKEN.substring(0, 10)}...`, 'success');
    results.tokens.botToken = true;
    
    // Test bot token
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` }
      });
      const data = await response.json();
      
      if (data.ok) {
        print(`Bot authenticated as: ${data.user} in team: ${data.team}`, 'success');
        results.tokens.botAuth = data;
      } else {
        print(`Bot token invalid: ${data.error}`, 'error');
        results.tokens.botAuth = { error: data.error };
      }
    } catch (e) {
      print(`Failed to test bot token: ${e.message}`, 'error');
    }
  }
  
  if (!SLACK_USER_TOKEN) {
    print('SLACK_USER_TOKEN not configured', 'warning');
    results.tokens.userToken = false;
  } else {
    print(`User token found: ${SLACK_USER_TOKEN.substring(0, 10)}...`, 'success');
    results.tokens.userToken = true;
    
    // Test user token
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: { 'Authorization': `Bearer ${SLACK_USER_TOKEN}` }
      });
      const data = await response.json();
      
      if (data.ok) {
        print(`User authenticated as: ${data.user} in team: ${data.team}`, 'success');
        results.tokens.userAuth = data;
      } else {
        print(`User token invalid: ${data.error}`, 'error');
        results.tokens.userAuth = { error: data.error };
      }
    } catch (e) {
      print(`Failed to test user token: ${e.message}`, 'error');
    }
  }
  
  if (!SLACK_SIGNING_SECRET) {
    print('SLACK_SIGNING_SECRET not configured', 'error');
    results.tokens.signingSecret = false;
  } else {
    print('Signing secret configured', 'success');
    results.tokens.signingSecret = true;
  }
}

async function testLocalServer() {
  print('\nTesting Local Server', 'header');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${LOCAL_SERVER}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      print('Local server is running', 'success');
      print(`Server version: ${health.version || 'unknown'}`, 'info');
      results.localServer.running = true;
    } else {
      print('Local server health check failed', 'error');
      results.localServer.running = false;
    }
    
    // Test Slack endpoints
    const endpoints = [
      '/slack/events',
      '/slack/commands',
      '/slack/interactive',
      '/slack/workflow'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${LOCAL_SERVER}${endpoint}`, { method: 'GET' });
        if (response.ok) {
          print(`Endpoint ${endpoint} is accessible`, 'success');
          results.localServer[endpoint] = true;
        } else {
          print(`Endpoint ${endpoint} returned ${response.status}`, 'warning');
          results.localServer[endpoint] = false;
        }
      } catch (e) {
        print(`Endpoint ${endpoint} is not accessible: ${e.message}`, 'error');
        results.localServer[endpoint] = false;
      }
    }
  } catch (e) {
    print(`Local server is not running: ${e.message}`, 'error');
    results.localServer.running = false;
  }
}

async function testPublicUrl() {
  print('\nTesting Public URL (Cloudflare Tunnel)', 'header');
  
  try {
    const response = await fetch(`${PUBLIC_URL}/health`);
    if (response.ok) {
      print('Public URL is accessible', 'success');
      results.publicUrl.accessible = true;
      
      // Test if it's reaching our server
      const data = await response.json();
      if (data.server === 'cursor-web-proxy') {
        print('Public URL correctly routes to your server', 'success');
        results.publicUrl.correctRouting = true;
      } else {
        print('Public URL may be routing to wrong server', 'warning');
        results.publicUrl.correctRouting = false;
      }
    } else {
      print(`Public URL returned status ${response.status}`, 'error');
      results.publicUrl.accessible = false;
    }
  } catch (e) {
    print(`Public URL is not accessible: ${e.message}`, 'error');
    results.publicUrl.accessible = false;
  }
}

async function testSlackAPI() {
  print('\nTesting Slack API Permissions', 'header');
  
  if (!SLACK_BOT_TOKEN) {
    print('Skipping API tests - no bot token', 'warning');
    return;
  }
  
  const requiredScopes = [
    'app_mentions:read',
    'channels:history',
    'chat:write',
    'commands',
    'users:read',
    'im:history',
    'reactions:write'
  ];
  
  try {
    // Get bot permissions
    const response = await fetch('https://slack.com/api/auth.test', {
      headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` }
    });
    const data = await response.json();
    
    if (data.ok) {
      // List installed scopes (this would need apps.permissions.scopes.list in production)
      print('Bot token is valid', 'success');
      
      // Test specific API calls
      const apiTests = [
        { 
          name: 'List conversations', 
          endpoint: 'conversations.list',
          params: 'limit=1'
        },
        { 
          name: 'Get user info', 
          endpoint: 'users.info',
          params: `user=${data.user_id}`
        }
      ];
      
      for (const test of apiTests) {
        try {
          const testResponse = await fetch(`https://slack.com/api/${test.endpoint}?${test.params}`, {
            headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` }
          });
          const testData = await testResponse.json();
          
          if (testData.ok) {
            print(`${test.name}: ✓`, 'success');
            results.slackApi[test.endpoint] = true;
          } else {
            print(`${test.name}: ${testData.error}`, 'error');
            results.slackApi[test.endpoint] = { error: testData.error };
          }
        } catch (e) {
          print(`${test.name}: Failed - ${e.message}`, 'error');
        }
      }
    }
  } catch (e) {
    print(`Failed to test Slack API: ${e.message}`, 'error');
  }
}

async function testWebhookConfig() {
  print('\nChecking Webhook Configuration', 'header');
  
  print('Expected Slack App Configuration:', 'info');
  print('  Event Subscriptions URL:', 'info');
  print(`    ${PUBLIC_URL}/slack/events`, 'info');
  print('  Interactivity URL:', 'info');
  print(`    ${PUBLIC_URL}/slack/interactive`, 'info');
  print('  Slash Commands:', 'info');
  print(`    Request URL: ${PUBLIC_URL}/slack/commands`, 'info');
  print('  Workflow Steps:', 'info');
  print(`    ${PUBLIC_URL}/slack/workflow`, 'info');
  
  // Simulate a slash command locally
  print('\nSimulating slash command locally...', 'info');
  
  try {
    const testCommand = new URLSearchParams({
      token: 'test-token',
      team_id: 'T1234567890',
      team_domain: 'test-team',
      channel_id: 'C1234567890',
      channel_name: 'general',
      user_id: 'U1234567890',
      user_name: 'testuser',
      command: '/auto-jack',
      text: 'test',
      response_url: 'https://hooks.slack.com/commands/1234/5678',
      trigger_id: '13345224609.738474920.8088930838d88f008e0'
    });
    
    const response = await fetch(`${LOCAL_SERVER}/slack/commands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Slack-Signature': 'v0=test',
        'X-Slack-Request-Timestamp': Math.floor(Date.now() / 1000).toString()
      },
      body: testCommand.toString()
    });
    
    if (response.ok) {
      const data = await response.json();
      print('Local slash command simulation successful', 'success');
      print(`Response: ${JSON.stringify(data)}`, 'info');
      results.webhooks.localCommand = true;
    } else {
      print(`Local slash command simulation failed: ${response.status}`, 'error');
      results.webhooks.localCommand = false;
    }
  } catch (e) {
    print(`Failed to simulate slash command: ${e.message}`, 'error');
    results.webhooks.localCommand = false;
  }
}

async function provideDiagnosis() {
  print('\n=============================', 'header');
  print('DIAGNOSIS & RECOMMENDATIONS', 'header');
  print('=============================\n', 'header');
  
  const issues = [];
  const fixes = [];
  
  // Analyze results
  if (!results.tokens.signingSecret) {
    issues.push('Missing SLACK_SIGNING_SECRET');
    fixes.push('Add SLACK_SIGNING_SECRET to your .env file');
  }
  
  if (!results.tokens.botToken) {
    issues.push('Missing SLACK_BOT_TOKEN');
    fixes.push('Add SLACK_BOT_TOKEN (xoxb-...) to your .env file');
  } else if (results.tokens.botAuth?.error) {
    issues.push(`Invalid bot token: ${results.tokens.botAuth.error}`);
    fixes.push('Regenerate your bot token in Slack App settings');
  }
  
  if (!results.localServer.running) {
    issues.push('Local server is not running');
    fixes.push('Start the server with: npm run slack:start');
  }
  
  if (!results.publicUrl.accessible) {
    issues.push('Public URL is not accessible');
    fixes.push('Check if Cloudflare tunnel is running');
    fixes.push('Run: ./cloudflare-tunnel/start-tunnel.sh');
  } else if (!results.publicUrl.correctRouting) {
    issues.push('Public URL not routing to your server');
    fixes.push('Check Cloudflare tunnel configuration');
  }
  
  // Check for "dispatch_failed" specific issue
  if (results.tokens.botToken && results.localServer.running && !results.publicUrl.accessible) {
    issues.push('This is likely causing your "dispatch_failed" error');
    fixes.push('Slack cannot reach your local server through the public URL');
  }
  
  if (issues.length > 0) {
    print('Issues Found:', 'error');
    issues.forEach(issue => print(`  • ${issue}`, 'warning'));
    
    print('\nRecommended Fixes:', 'info');
    fixes.forEach((fix, i) => print(`  ${i + 1}. ${fix}`, 'success'));
  } else {
    print('All tests passed! Your Slack integration should be working.', 'success');
    print('If you still see "dispatch_failed", check:', 'info');
    print('  1. Your Slack App settings have the correct URLs', 'info');
    print('  2. The slash command is configured with the right URL', 'info');
    print('  3. Your app is installed to the workspace', 'info');
  }
  
  // Save detailed results
  const fs = await import('fs');
  const resultsFile = './slack/debug/test-results.json';
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  print(`\nDetailed results saved to: ${resultsFile}`, 'info');
}

async function runTests() {
  print('====================================', 'header');
  print('SLACK INTEGRATION DIAGNOSTIC TOOL', 'header');
  print('====================================', 'header');
  
  await testTokens();
  await testLocalServer();
  await testPublicUrl();
  await testSlackAPI();
  await testWebhookConfig();
  await provideDiagnosis();
  
  rl.close();
}

// Run the tests
runTests().catch(console.error);