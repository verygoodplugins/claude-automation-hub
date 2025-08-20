#!/usr/bin/env node

/**
 * Simple notification test to debug formatting
 */

async function testCleanNotification() {
  const fetch = (await import('node-fetch')).default;
  
  const topic = process.env.NTFY_TOPIC || 'claude-automation-test-topic';
  
  console.log(`Testing clean notification to topic: ${topic}`);
  
  // Test 1: Simple string message
  console.log('1. Sending simple string...');
  await fetch(`https://ntfy.sh/${topic}`, {
    method: 'POST',
    body: 'Simple string message - should be clean!'
  });
  
  // Wait a moment
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 2: Clean JSON
  console.log('2. Sending clean JSON...');
  await fetch(`https://ntfy.sh/${topic}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: '✅ Clean Test',
      message: 'This should be a clean notification!'
    })
  });
  
  console.log('✅ Both notifications sent. Check your phone!');
}

testCleanNotification().catch(console.error);
