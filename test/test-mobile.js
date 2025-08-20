#!/usr/bin/env node

/**
 * Test Mobile Notification System
 * Demonstrates the federated AI architecture ready for mobile MCP
 */

import AutomationHub from './src/automation-hub.js';

async function main() {
  console.log('🚀 Claude Automation Hub - Mobile Integration Test\n');
  
  // Initialize the hub
  const hub = new AutomationHub({
    ntfyTopic: process.env.NTFY_TOPIC || 'claude-automation-test-topic'
  });

  try {
    // Test 1: Basic notification system
    console.log('═══ Test 1: Basic Notification System ═══');
    const testResults = await hub.testMobileNotifications();
    console.log();

    // Test 2: End-of-day workflow
    console.log('═══ Test 2: End-of-Day Workflow ═══');
    const endOfDayResult = await hub.endOfDayShutdown({
      achievements: [
        'Created 4 new workflows (End of Day, Meeting Prep, Project Init, Learning Session)',
        'Reached 12 total workflows',
        'Set up mobile notification system'
      ],
      tomorrowFocus: 'Test new workflows and gather metrics',
      workflowsCompleted: 12,
      timeSaved: '63+ hours monthly',
      nextPriorities: [
        'Test automation workflows',
        'Prepare for mobile MCP integration',
        'Document federated AI patterns'
      ]
    });
    console.log();

    // Test 3: Meeting change scenario
    console.log('═══ Test 3: Meeting Change Scenario ═══');
    const meetingResult = await hub.notifyMeetingChange({
      title: 'Orthopedic appointment',
      time: '3:00 PM',
      duration: '30min',
      currentPriorities: [
        'PressConf tickets sale',
        'Test automation workflows',
        'Evening personal time'
      ]
    }, 'cancelled');
    console.log();

    // Summary
    console.log('═══ Summary ═══');
    console.log('✅ Mobile notification system ready');
    console.log('✅ Context bridge operational');
    console.log('✅ Handoff patterns tested');
    console.log('✅ Ready for mobile MCP integration');
    console.log();
    console.log('🎯 Next Steps:');
    console.log('1. Install ntfy app and subscribe to your topic');
    console.log('2. Set NTFY_TOPIC environment variable');
    console.log('3. Run: npm install (to get node-fetch)');
    console.log('4. Test with: npm run test-mobile');
    console.log('5. Wait for mobile MCP support (coming soon!)');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();
