#!/usr/bin/env node

/**
 * Manual Morning Routine Trigger
 * Test your morning routine workflow right now
 */

import AutomationHub from './src/automation-hub.js';

async function triggerMorningRoutine() {
  console.log('🌅 Manually triggering Morning Routine...\n');
  
  const hub = new AutomationHub({
    ntfyTopic: process.env.NTFY_TOPIC || 'claude-automation-test-topic'
  });

  try {
    // Trigger the morning routine manually
    console.log('⚡ Executing morning routine workflow...');
    await hub.scheduler.runMorningRoutine();
    
    console.log('\n✅ Morning routine completed!');
    console.log('📱 Check your phone for the bundled notification');
    
    // Also trigger end-of-day for comparison
    console.log('\n🌇 Bonus: Also triggering end-of-day workflow...');
    await hub.scheduler.runEndOfDay();
    
    console.log('\n🎯 Both workflows completed!');
    console.log('📦 They should bundle together into one smart notification');
    
    // Wait a moment then flush the bundle
    setTimeout(async () => {
      console.log('\n🚀 Flushing bundle to send immediately...');
      await hub.flushBundle();
      console.log('✅ Bundle sent to your phone!');
    }, 2000);
    
  } catch (error) {
    console.error('❌ Failed to trigger morning routine:', error);
  }
}

triggerMorningRoutine();
