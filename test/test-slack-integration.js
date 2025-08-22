#!/usr/bin/env node
/**
 * Test script for Slack integration
 * Verifies all endpoints are working correctly
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_URL || 'http://localhost:8765';

async function testEndpoint(name, path, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${path}`, options);
    const status = response.status;
    const data = await response.text();
    
    console.log(`✅ ${name}: ${status} ${status === 200 ? 'OK' : 'FAILED'}`);
    
    if (status !== 200) {
      console.log(`   Response: ${data.substring(0, 100)}`);
    }
    
    return status === 200;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Slack Integration Endpoints\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test health endpoint
  if (await testEndpoint('Health Check', '/health')) passed++; else failed++;
  
  // Test Slack events endpoint (GET)
  if (await testEndpoint('Events Endpoint (GET)', '/slack/events')) passed++; else failed++;
  
  // Test URL verification challenge
  const challenge = await testEndpoint(
    'URL Verification',
    '/slack/events',
    'POST',
    { challenge: 'test_challenge_123' }
  );
  if (challenge) passed++; else failed++;
  
  // Test event handling
  const event = await testEndpoint(
    'Event Handling',
    '/slack/events',
    'POST',
    {
      event: {
        type: 'message',
        channel: 'C123',
        user: 'U456',
        text: 'Test message'
      }
    }
  );
  if (event) passed++; else failed++;
  
  // Test slash command
  const command = await testEndpoint(
    'Slash Command',
    '/slack/commands',
    'POST',
    {
      command: '/claude',
      text: 'test',
      user_name: 'testuser'
    }
  );
  if (command) passed++; else failed++;
  
  // Test interactive endpoint
  const interactive = await testEndpoint(
    'Interactive Endpoint',
    '/slack/interactive',
    'POST',
    {
      payload: JSON.stringify({
        type: 'shortcut',
        callback_id: 'test'
      })
    }
  );
  if (interactive) passed++; else failed++;
  
  // Test workflow endpoint
  if (await testEndpoint('Workflow Endpoint', '/slack/workflow', 'POST', {})) passed++; else failed++;
  
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round(passed / (passed + failed) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Slack integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the server logs for details.');
  }
}

// Run tests
runTests().catch(console.error);