#!/usr/bin/env node

/**
 * Test Action Buttons Only
 * Quick test to verify ntfy action button format
 */

async function testActionButtons() {
  const fetch = (await import('node-fetch')).default;
  
  const topic = process.env.NTFY_TOPIC || 'claude-automation-test-topic';
  
  console.log('🔘 Testing action buttons...');
  
  const testNotification = {
    title: 'Action Button Test',
    message: 'Testing action buttons with ntfy',
    actions: [
      {
        action: 'view',
        label: 'Ask Claude',
        url: 'https://claude.ai/chat/new?message=Test%20from%20action%20button'
      },
      {
        action: 'view', 
        label: 'Open Google',
        url: 'https://google.com'
      }
    ]
  };
  
  // Format actions for ntfy
  const actionStrings = testNotification.actions.map(action => {
    return `view, ${action.label}, ${action.url}`;
  });
  
  const actionsHeader = actionStrings.join('; ');
  console.log('📋 Actions header:', actionsHeader);
  
  await fetch(`https://ntfy.sh/${topic}`, {
    method: 'POST',
    headers: {
      'Title': 'Action Button Test',
      'Actions': actionsHeader
    },
    body: testNotification.message
  });
  
  console.log('✅ Test notification with action buttons sent!');
  console.log('📱 Check your phone - you should see action buttons');
}

testActionButtons().catch(console.error);
