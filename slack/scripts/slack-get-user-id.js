#!/usr/bin/env node
/**
 * Get your Slack User ID
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

if (!SLACK_BOT_TOKEN) {
  console.error('❌ Missing SLACK_BOT_TOKEN in .env file');
  process.exit(1);
}

async function getAuthTest() {
  console.log('🔍 Testing bot authentication...\n');
  
  try {
    const response = await fetch('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Bot authenticated successfully!');
      console.log('📋 Bot Info:');
      console.log('   Team:', result.team);
      console.log('   Team ID:', result.team_id);
      console.log('   Bot User ID:', result.user_id);
      console.log('   Bot Name:', result.user);
      console.log('\n💡 Use this Bot User ID to test the home tab:', result.user_id);
      
      return result.user_id;
    } else {
      console.error('❌ Authentication failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('💥 Error:', error);
    return null;
  }
}

async function listUsers() {
  console.log('\n📋 Getting workspace users...\n');
  
  try {
    const response = await fetch('https://slack.com/api/users.list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('👥 Workspace Users:');
      console.log('─'.repeat(50));
      
      result.members
        .filter(u => !u.is_bot && !u.deleted)
        .slice(0, 10)
        .forEach(user => {
          console.log(`   ${user.real_name || user.name}`);
          console.log(`   ID: ${user.id}`);
          console.log(`   Email: ${user.profile?.email || 'N/A'}`);
          console.log('─'.repeat(50));
        });
        
      // Find yourself
      const you = result.members.find(u => 
        u.profile?.email?.includes('jack') || 
        u.real_name?.toLowerCase().includes('jack') ||
        u.name?.toLowerCase().includes('jack')
      );
      
      if (you) {
        console.log('\n🎯 Found you!');
        console.log('   Name:', you.real_name || you.name);
        console.log('   User ID:', you.id);
        console.log('\n💡 Use this User ID for the home tab:', you.id);
      }
    } else {
      console.error('❌ Failed to list users:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Run both
(async () => {
  await getAuthTest();
  await listUsers();
})();