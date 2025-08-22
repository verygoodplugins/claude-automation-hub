#!/usr/bin/env node
/**
 * Setup Slack Home Tab - Beautiful Native Design v2
 * Follows Slack Block Kit best practices for a polished look
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_USER_ID = process.env.SLACK_USER_ID || 'U13ECGWTA';

if (!SLACK_BOT_TOKEN) {
  console.error('❌ Missing SLACK_BOT_TOKEN in .env file');
  console.error('📝 Note: views.publish requires a BOT token (xoxb-), not a user token');
  process.exit(1);
}

// Beautiful, well-spaced home view with native Slack design
const homeView = {
  type: 'home',
  blocks: [
    // Clean header section
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'AI Command Center',
        emoji: true
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: 'Powered by Claude 3.5 Sonnet • MCP Protocol • Real-time automation'
        }
      ]
    },
    {
      type: 'divider'
    },
    
    // Welcome section with better spacing
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Welcome back, Jack!* 👋\n\nYour AI assistant is ready to help automate your workflow and save you time.'
      }
    },
    
    // Quick actions with proper buttons
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Quick Actions*'
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '💬  Start AI Chat',
            emoji: true
          },
          style: 'primary',
          action_id: 'start_chat'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '📊  Analyze',
            emoji: true
          },
          action_id: 'analyze'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '📝  Generate',
            emoji: true
          },
          action_id: 'generate'
        }
      ]
    },
    
    // Add spacing
    {
      type: 'section',
      text: {
        type: 'plain_text',
        text: ' ',
        emoji: false
      }
    },
    
    // Stats section with clean grid
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*📈 Today\'s Impact*'
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: '*Tasks Automated*\n`127` completed'
        },
        {
          type: 'mrkdwn',
          text: '*Time Saved*\n`3.2` hours'
        },
        {
          type: 'mrkdwn',
          text: '*Tickets Resolved*\n`8` with AI assist'
        },
        {
          type: 'mrkdwn',
          text: '*Active Workflows*\n`5` running'
        }
      ]
    },
    
    // Spacing
    {
      type: 'divider'
    },
    
    // System status with clean indicators
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*🟢 System Status*\nAll services operational'
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Details',
          emoji: false
        },
        action_id: 'view_status'
      }
    },
    
    // MCP Services in a clean format
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '✅ FreeScout  ✅ WordPress  ✅ OpenMemory  ✅ Playwright  ✅ PostgreSQL'
        }
      ]
    },
    
    {
      type: 'divider'
    },
    
    // Workflow launcher with better design
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*⚡ Run Workflow*'
      },
      accessory: {
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Choose workflow...',
          emoji: false
        },
        action_id: 'select_workflow',
        options: [
          {
            text: {
              type: 'plain_text',
              text: '🌅 Morning Routine',
              emoji: true
            },
            value: 'morning'
          },
          {
            text: {
              type: 'plain_text',
              text: '🎫 Support Triage',
              emoji: true
            },
            value: 'triage'
          },
          {
            text: {
              type: 'plain_text',
              text: '📊 Weekly Review',
              emoji: true
            },
            value: 'review'
          },
          {
            text: {
              type: 'plain_text',
              text: '🚀 Deploy Update',
              emoji: true
            },
            value: 'deploy'
          }
        ]
      }
    },
    
    {
      type: 'divider'
    },
    
    // Recent activity with cleaner format
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*🕐 Recent Activity*'
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '• *2 min ago* — Analyzed support ticket #5847 with 95% confidence\n• *15 min ago* — Generated blog post draft for WP Fusion\n• *1 hour ago* — Synchronized 43 customer records\n• *2 hours ago* — Completed morning automation routine'
      }
    },
    
    // AI insights section
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*💡 AI Insights*'
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '_Based on your patterns:_\n• Consider automating your 3pm status update\n• You have 3 similar tickets that could become a KB article\n• Morning routine saved 27 minutes today (new record!)'
      }
    },
    
    // Monthly summary with better layout
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*📊 November Summary*'
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: '*Total Automated*\n`2,847` tasks'
        },
        {
          type: 'mrkdwn',
          text: '*Hours Saved*\n`63.5` hours'
        },
        {
          type: 'mrkdwn',
          text: '*Cost Savings*\n`$3,175` estimated'
        },
        {
          type: 'mrkdwn',
          text: '*Efficiency Gain*\n`+340%` vs manual'
        }
      ]
    },
    
    // Help section
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Need Help?*'
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '📖 Documentation',
            emoji: true
          },
          action_id: 'view_docs'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '⚙️ Settings',
            emoji: true
          },
          action_id: 'open_settings'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '💬 Support',
            emoji: true
          },
          action_id: 'get_support'
        }
      ]
    },
    
    // Footer with version info and timestamp for cache busting
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Claude Automation Hub v1.0.0 • Updated: ${new Date().toLocaleTimeString()} • \`/claude\` for quick access`
        }
      ]
    }
  ]
};

async function publishHomeView(userId) {
  console.log('🎨 Publishing beautiful native-style home view for user:', userId);
  
  try {
    const response = await fetch('https://slack.com/api/views.publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        view: homeView
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Success! Beautiful home tab published!');
      console.log('🎉 Open Slack and click on your app\'s Home tab to see the polished design!');
      return true;
    } else {
      console.error('❌ Failed to publish home view:', result.error);
      if (result.response_metadata) {
        console.error('📝 Error details:', JSON.stringify(result.response_metadata, null, 2));
      }
      return false;
    }
  } catch (error) {
    console.error('💥 Error publishing home view:', error);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Claude AI Slack Home Tab Setup - Native Design v2');
  console.log('=====================================================\n');
  
  const userId = process.argv[2] || SLACK_USER_ID;
  
  if (!userId) {
    console.log('Usage: node setup-slack-home-v2.js [USER_ID]');
    console.log('Or set SLACK_USER_ID in your .env file\n');
    process.exit(1);
  }
  
  console.log('🎯 Setting up home tab for user:', userId);
  console.log('🔑 Using bot token:', SLACK_BOT_TOKEN.substring(0, 20) + '...\n');
  
  const success = await publishHomeView(userId);
  
  if (success) {
    console.log('\n✨ Your beautifully designed Slack home is ready!');
    console.log('🏠 Go to Slack → Apps → Your App → Home tab');
  } else {
    console.log('\n😞 Setup failed. Check the errors above.');
  }
}

// Run the setup
main().catch(console.error);