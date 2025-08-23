#!/usr/bin/env node

/**
 * Test Automated Workflow Scheduler
 * Demonstrates how to automatically trigger workflows at scheduled times
 */

import AutomationHub from '../src/automation-hub.js';

async function main() {
  console.log('⏰ Claude Automation Hub - Scheduler Test\n');
  
  // Initialize the hub
  const hub = new AutomationHub({
    ntfyTopic: process.env.NTFY_TOPIC || 'claude-automation-test-topic',
    timezone: 'Europe/Berlin'
  });

  try {
    console.log('═══ Test 1: Scheduler Status ═══');
    
    // Check initial status
    let status = hub.getSchedulerStatus();
    console.log('📊 Initial Status:', status);
    
    console.log('\n═══ Test 2: Starting Automated Scheduler ═══');
    
    // Start the scheduler with predefined workflows
    const startResult = hub.startScheduler();
    console.log('✅', startResult.message);
    
    // List active schedules
    console.log('\n📅 Active Schedules:');
    hub.listSchedules();
    
    console.log('\n═══ Test 3: Custom Schedule Demo ═══');
    
    // Add a custom schedule for testing (runs in 2 minutes)
    const now = new Date();
    const testTime = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes from now
    const testTimeString = `${testTime.getHours().toString().padStart(2, '0')}:${testTime.getMinutes().toString().padStart(2, '0')}`;
    
    hub.addSchedule('test-workflow', testTimeString, [now.getDay() || 7], async () => {
      console.log('🧪 TEST WORKFLOW TRIGGERED!');
      await hub.notifyWorkflowComplete('Test Scheduled Workflow', {
        triggeredAt: new Date().toLocaleTimeString(),
        type: 'scheduled-test'
      });
    });
    
    console.log(`⏰ Added test schedule: ${testTimeString} (runs in ~2 minutes)`);
    
    console.log('\n═══ Test 4: Predefined Workflows ═══');
    console.log('🌅 Morning Routine: 7:00 AM Mon-Fri');
    console.log('🌇 End of Day: 5:30 PM Mon-Fri'); 
    console.log('📊 Weekly Review: Friday 4:00 PM');
    console.log('🔍 Urgent Check: Every 15 minutes during work hours');
    
    console.log('\n═══ Test 5: Manual Workflow Triggers ═══');
    
    // Manually trigger the morning routine to see what it does
    console.log('Manually triggering morning routine...');
    await hub.scheduler.runMorningRoutine();
    
    console.log('\nManually triggering end-of-day workflow...');
    await hub.scheduler.runEndOfDay();
    
    console.log('\n═══ Test 6: Real-World Integration ═══');
    console.log('🔗 Integration Options:');
    console.log('');
    console.log('📱 **Mobile Detection**: Add location-based triggers');
    console.log('   - "When I arrive at office → start morning routine"');
    console.log('   - "When I leave office → start end-of-day workflow"');
    console.log('');
    console.log('📧 **MCP Integration**: Connect to real data sources');
    console.log('   - "Check Gmail every 15 minutes for urgent emails"');
    console.log('   - "Monitor calendar for meeting changes"');  
    console.log('   - "Watch Slack for mentions"');
    console.log('');
    console.log('🤖 **AI Context**: Smart scheduling based on patterns');
    console.log('   - "If user typically works late Friday → delay end-of-day"');
    console.log('   - "If urgent email detected → bundle with higher priority"');
    console.log('   - "If many meetings cancelled → suggest focus time"');
    
    console.log('\n═══ How to Use in Production ═══');
    console.log('');
    console.log('1. **Start the scheduler once:**');
    console.log('   const hub = new AutomationHub();');
    console.log('   hub.startScheduler();');
    console.log('');
    console.log('2. **Keep it running:** The scheduler will automatically trigger:');
    console.log('   - Morning routine at 7:00 AM Mon-Fri');
    console.log('   - End-of-day at 5:30 PM Mon-Fri');
    console.log('   - Weekly review Friday 4:00 PM');
    console.log('   - Urgent checks every 15 minutes');
    console.log('');
    console.log('3. **Customize schedules:**');
    console.log('   hub.addSchedule("custom-workflow", "09:30", [1,2,3,4,5], myFunction);');
    console.log('');
    console.log('4. **Integration with Claude Desktop:**');
    console.log('   - Run this as a background service');
    console.log('   - Connect via MCPs for real data');
    console.log('   - Notifications work with bundling system');
    
    console.log('\n⏰ Scheduler is now running...');
    console.log('🎯 Your 7 AM morning routine will trigger automatically tomorrow!');
    console.log('📱 All workflows will send bundled notifications with action buttons');
    console.log('');
    console.log('Press Ctrl+C to stop the scheduler when done testing');
    
    // Keep the process running to test scheduling
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping scheduler...');
      hub.stopScheduler();
      console.log('✅ Scheduler stopped. Goodbye!');
      process.exit(0);
    });
    
    // Optional: Stop after 5 minutes for demo
    setTimeout(() => {
      console.log('\n⏰ Demo timeout - stopping scheduler...');
      hub.stopScheduler();
      process.exit(0);
    }, 5 * 60 * 1000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();
