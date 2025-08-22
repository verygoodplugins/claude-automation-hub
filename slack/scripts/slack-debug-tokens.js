#!/usr/bin/env node
/**
 * Debug Slack Token Types and Capabilities
 * Helps understand which token works for which operation
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Different token types
const tokens = {
  bot: process.env.SLACK_BOT_TOKEN,      // xoxb- token
  user: process.env.SLACK_USER_TOKEN,    // xoxp- token
  // Note: xoxc/xoxd tokens are browser session tokens, not API tokens
};

console.log('🔍 Slack Token Diagnostic Tool\n');
console.log('=' .repeat(50));

// Check which tokens are configured
console.log('\n📋 Token Configuration:');
for (const [type, token] of Object.entries(tokens)) {
  if (token) {
    console.log(`✅ ${type.toUpperCase()} token: ${token.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${type.toUpperCase()} token: Not configured`);
  }
}

// Test different API endpoints with each token
async function testEndpoint(name, endpoint, method = 'POST', body = {}) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log('-'.repeat(40));
  
  for (const [type, token] of Object.entries(tokens)) {
    if (!token) continue;
    
    try {
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      if (method === 'POST' && Object.keys(body).length > 0) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`https://slack.com/api/${endpoint}`, options);
      const result = await response.json();
      
      if (result.ok) {
        console.log(`  ✅ ${type.toUpperCase()} token: SUCCESS`);
      } else {
        console.log(`  ❌ ${type.toUpperCase()} token: ${result.error}`);
      }
    } catch (error) {
      console.log(`  💥 ${type.toUpperCase()} token: ${error.message}`);
    }
  }
}

// Run tests
async function runDiagnostics() {
  console.log('\n\n🚀 Running API Tests...');
  console.log('=' .repeat(50));
  
  // Test auth
  await testEndpoint('Authentication (auth.test)', 'auth.test');
  
  // Test conversation search (what MCP uses)
  await testEndpoint('Search Conversations', 'conversations.search', 'POST', {
    query: 'test',
    limit: 1
  });
  
  // Test views.publish (for home tab)
  await testEndpoint('Publish Home View', 'views.publish', 'POST', {
    user_id: 'U13ECGWTA',
    view: {
      type: 'home',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Test view'
          }
        }
      ]
    }
  });
  
  // Test sending messages
  await testEndpoint('Post Message', 'chat.postMessage', 'POST', {
    channel: 'U13ECGWTA',
    text: 'Test message (will not actually send)'
  });
  
  // Test user info
  await testEndpoint('User Info', 'users.info', 'POST', {
    user: 'U13ECGWTA'
  });
  
  console.log('\n\n📊 Summary:');
  console.log('=' .repeat(50));
  console.log(`
The Slack MCP in Claude Desktop uses xoxc/xoxd tokens (browser session tokens).
These are different from API tokens:

• xoxb- (Bot Token): For views.publish, sending messages, bot operations
• xoxp- (User Token): For user-level operations, some search functions
• xoxc/xoxd: Browser session tokens for web client, used by some MCPs

The error "not_allowed_token_type" occurs when:
1. Using wrong token type for an operation
2. Token lacks required scopes
3. MCP expects different token format

Solution:
- Keep Bot token (xoxb) for views.publish and API operations
- User token (xoxp) may work for some search operations
- MCP Slack server needs xoxc/xoxd tokens (from browser)
`);
}

// Run the diagnostics
runDiagnostics().catch(console.error);