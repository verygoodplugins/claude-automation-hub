#!/usr/bin/env node
/**
 * Verify Slack User Token Scopes for MCP Integration
 * Tests that the user token has all required permissions
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN;

if (!SLACK_USER_TOKEN) {
  console.error('❌ Missing SLACK_USER_TOKEN in .env file');
  process.exit(1);
}

console.log('🔍 Slack User Token Scope Verification\n');
console.log('=' .repeat(50));
console.log('Token:', SLACK_USER_TOKEN.substring(0, 30) + '...\n');

// Required scopes for Slack MCP Server
const REQUIRED_SCOPES = [
  'channels:history',  // View messages in public channels
  'channels:read',     // View basic info about public channels
  'groups:history',    // View messages in private channels
  'groups:read',       // View basic info about private channels
  'im:history',        // View direct message history
  'im:read',           // View direct message info
  'im:write',          // Start direct messages
  'mpim:history',      // View group DM history
  'mpim:read',         // View group DM info
  'mpim:write',        // Start group DMs
  'users:read',        // View workspace users
  'chat:write',        // Send messages
  'search:read'        // Search workspace content
];

// Test auth and get scopes
async function checkScopes() {
  try {
    const response = await fetch('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_USER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      console.error('❌ Authentication failed:', result.error);
      return null;
    }
    
    console.log('✅ Authentication successful!');
    console.log('   User:', result.user);
    console.log('   Team:', result.team);
    console.log('   User ID:', result.user_id);
    
    // Get OAuth scopes
    const scopeResponse = await fetch('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_USER_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Slack-User': result.user_id
      }
    });
    
    const scopeResult = await scopeResponse.json();
    return scopeResult;
    
  } catch (error) {
    console.error('💥 Error:', error);
    return null;
  }
}

// Test specific API endpoints
async function testEndpoint(name, endpoint, method = 'POST', body = {}) {
  try {
    // Search API requires URL-encoded format
    const isSearchAPI = endpoint === 'search.messages';
    
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${SLACK_USER_TOKEN}`,
        'Content-Type': isSearchAPI ? 'application/x-www-form-urlencoded' : 'application/json'
      }
    };
    
    if (method === 'POST' && Object.keys(body).length > 0) {
      if (isSearchAPI) {
        // URL encode for search API
        options.body = new URLSearchParams(body).toString();
      } else {
        options.body = JSON.stringify(body);
      }
    }
    
    const response = await fetch(`https://slack.com/api/${endpoint}`, options);
    const result = await response.json();
    
    if (result.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Run comprehensive tests
async function runTests(authUserId) {
  console.log('\n📋 Testing Required Endpoints:\n');
  
  // First, get a valid channel ID for testing
  let generalChannelId = null;
  try {
    const channelsResponse = await fetch('https://slack.com/api/conversations.list', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_USER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ limit: 10, types: 'public_channel' })
    });
    const channelsResult = await channelsResponse.json();
    if (channelsResult.ok && channelsResult.channels && channelsResult.channels.length > 0) {
      // Find #general or use first channel
      const generalChannel = channelsResult.channels.find(c => c.name === 'general') || channelsResult.channels[0];
      generalChannelId = generalChannel.id;
      console.log(`   Using channel: #${generalChannel.name} (${generalChannelId})\n`);
    }
  } catch (error) {
    console.log('   Could not fetch channels for testing\n');
  }

  // Test each required capability
  const tests = [
    {
      name: 'List Channels',
      endpoint: 'conversations.list',
      body: { limit: 1, types: 'public_channel' },
      scope: 'channels:read'
    },
    {
      name: 'Channel History',
      endpoint: 'conversations.history',
      body: { channel: generalChannelId || 'C13EF1H6V', limit: 1 },
      scope: 'channels:history',
      skipIfNoChannel: !generalChannelId
    },
    {
      name: 'Get Current User',
      endpoint: 'users.profile.get',
      body: {},  // Gets current authenticated user's profile
      scope: 'users:read'
    },
    {
      name: 'Search Messages',
      endpoint: 'search.messages',
      body: { query: 'from:me', count: 1 },  // Search for messages from current user
      scope: 'search:read'
    },
    {
      name: 'List DMs',
      endpoint: 'conversations.list',
      body: { limit: 1, types: 'im' },
      scope: 'im:read'
    },
    {
      name: 'Send Message Test',
      endpoint: 'chat.postMessage',
      body: { channel: '@jgarturo', text: 'MCP test (not sent)', dry_run: true },
      scope: 'chat:write'
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    if (test.skipIfNoChannel) {
      process.stdout.write(`Testing ${test.name} (${test.scope})... `);
      console.log('⏭️  Skipped (no channel available)');
      results.push({ ...test, status: 'skip' });
      continue;
    }
    
    process.stdout.write(`Testing ${test.name} (${test.scope})... `);
    
    // Add delays between API calls to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await testEndpoint(test.name, test.endpoint, 'POST', test.body);
    
    if (result.success) {
      console.log('✅');
      results.push({ ...test, status: 'pass' });
    } else if (result.error === 'ratelimited') {
      // Retry once after a longer delay for rate limited requests
      console.log('⏳ Rate limited, retrying...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      process.stdout.write(`Testing ${test.name} (${test.scope})... `);
      const retryResult = await testEndpoint(test.name, test.endpoint, 'POST', test.body);
      
      if (retryResult.success) {
        console.log('✅');
        results.push({ ...test, status: 'pass' });
      } else {
        console.log(`❌ ${retryResult.error}`);
        results.push({ ...test, status: 'fail', error: retryResult.error });
      }
    } else {
      console.log(`❌ ${result.error}`);
      results.push({ ...test, status: 'fail', error: result.error });
    }
  }
  
  // Summary
  console.log('\n📊 Summary:\n');
  console.log('=' .repeat(50));
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  if (skipped > 0) {
    console.log(`⏭️  Skipped: ${skipped}/${tests.length}`);
  }
  
  if (failed > 0) {
    console.log('\n⚠️  Missing Scopes:');
    const missingScopes = new Set();
    results.filter(r => r.status === 'fail' && r.error === 'missing_scope')
      .forEach(r => missingScopes.add(r.scope));
    
    missingScopes.forEach(scope => {
      console.log(`   - ${scope}`);
    });
    
    console.log('\n📝 To fix:');
    console.log('1. Go to https://api.slack.com/apps');
    console.log('2. Select your app');
    console.log('3. Go to "OAuth & Permissions"');
    console.log('4. Add the missing scopes under "User Token Scopes"');
    console.log('5. Reinstall the app to your workspace');
    console.log('6. Copy the new User OAuth Token to your .env file');
  } else {
    console.log('\n🎉 All required scopes are configured!');
    console.log('Your Slack MCP integration should work correctly.');
  }
  
  // Test MCP-specific operations
  console.log('\n🔧 MCP Compatibility Check:\n');
  
  // Test search (main MCP operation)
  const searchTest = await testEndpoint('Search', 'search.messages', 'POST', {
    query: 'from:me',
    count: 1
  });
  
  if (searchTest.success) {
    console.log('✅ Search API works - MCP search will function');
  } else if (searchTest.error === 'missing_scope') {
    console.log('❌ Missing search:read scope - MCP search won\'t work');
  } else {
    console.log('⚠️  Search API issue:', searchTest.error);
  }
}

// Main execution
(async () => {
  const authResult = await checkScopes();
  if (authResult) {
    await runTests(authResult.user_id);
  }
  
  console.log('\n💡 Note: After updating scopes, restart Cursor/Claude Desktop');
  console.log('   for the MCP changes to take effect.\n');
})();