#!/usr/bin/env node
/**
 * Test script to verify cursor + cursor-agent integration
 * Tests the combined approach for opening files and injecting prompts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testCursorIntegration() {
  console.log('🧪 Testing Cursor CLI Integration\n');
  
  // Test 1: Open file at specific line with --goto
  console.log('Test 1: Opening file at specific line...');
  const testFile = 'README.md';
  const lineNumber = 10;
  const columnNumber = 1;
  
  const gotoCommand = `cursor --goto "${testFile}:${lineNumber}:${columnNumber}"`;
  console.log(`Command: ${gotoCommand}`);
  
  try {
    await execAsync(gotoCommand);
    console.log('✅ File opened successfully\n');
    
    // Wait a moment for Cursor to open
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Send prompt to cursor-agent
    console.log('Test 2: Sending prompt to cursor-agent...');
    const prompt = "Add a comment at this line explaining what this section does";
    const agentCommand = `cursor-agent -p "${prompt}" --print --background`;
    console.log(`Command: ${agentCommand}`);
    
    // Note: This will fail if not logged in, but shows the correct syntax
    try {
      const { stdout, stderr } = await execAsync(agentCommand, { timeout: 5000 });
      console.log('✅ Prompt sent successfully');
      if (stdout) console.log('Output:', stdout);
    } catch (agentError) {
      console.log('⚠️  Agent command failed (likely needs login)');
      console.log('Error:', agentError.message);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
  
  console.log('\n📝 Combined command approach:');
  console.log('1. First: cursor --goto "file.js:42:1"');
  console.log('2. Then: cursor-agent -p "Fix the bug at line 42" --print');
  console.log('\nThis opens the file at the right line, then sends the prompt to the agent.');
}

// Test the combined approach with a real scenario
async function testRealScenario() {
  console.log('\n🎯 Real Scenario Test\n');
  
  const task = {
    file: 'tools/cursor-cli-deeplink.js',
    lineNumber: 100,
    columnNumber: 1,
    prompt: 'Review this function and suggest improvements for error handling'
  };
  
  console.log('Task:', JSON.stringify(task, null, 2));
  
  // Combined approach
  const commands = [
    `cursor --goto "${task.file}:${task.lineNumber}:${task.columnNumber}"`,
    `cursor-agent -p "${task.prompt}" --background`
  ];
  
  console.log('\nExecuting commands:');
  for (const cmd of commands) {
    console.log(`  ${cmd}`);
  }
  
  // Execute sequentially
  try {
    console.log('\nStep 1: Opening file...');
    await execAsync(commands[0]);
    console.log('✅ File opened');
    
    // Small delay to ensure Cursor is ready
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('\nStep 2: Sending prompt...');
    try {
      await execAsync(commands[1], { timeout: 5000 });
      console.log('✅ Prompt sent to agent');
    } catch (agentError) {
      if (agentError.message.includes('Not logged in')) {
        console.log('⚠️  Agent needs authentication. Run: cursor-agent login');
      } else {
        console.log('⚠️  Agent command failed:', agentError.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Execution failed:', error.message);
  }
}

// Run tests
async function main() {
  await testCursorIntegration();
  await testRealScenario();
  
  console.log('\n✨ Test complete!');
  console.log('\nFor the web proxy implementation:');
  console.log('1. Use cursor --goto for precise file/line opening');
  console.log('2. Follow with cursor-agent -p for prompt injection');
  console.log('3. Ensure cursor-agent is authenticated first');
}

main().catch(console.error);