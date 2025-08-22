/**
 * Claude AI Service for Slack Integration
 * 
 * Handles communication with Claude API and executes MCP tools
 */

import Anthropic from '@anthropic-ai/sdk';
import { MCPExecutor } from './mcp-executor.js';
import dotenv from 'dotenv';

dotenv.config();

class ClaudeService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    this.mcpExecutor = new MCPExecutor();
    this.model = 'claude-3-5-sonnet-latest'; // Latest Sonnet model
    
    // System prompt that gives Claude access to MCP tools
    this.systemPrompt = `You are Claude, an AI assistant integrated with Slack and running on a local machine with access to various MCP (Model Context Protocol) tools.

You have access to these MCP tools:
- FreeScout: Manage support tickets
- WordPress: Create and manage content
- Playwright: Browser automation and testing
- PostgreSQL: Database queries
- OpenMemory: Store and retrieve information
- Apple ecosystem: Calendar, mail, reminders, messages
- Files: Read and write local files
- Git: Version control operations
- NTFY: Send mobile notifications

When users ask you to perform tasks, you should:
1. Understand what they want
2. Use the appropriate MCP tools to complete the task
3. Provide clear, concise responses
4. Format responses nicely for Slack (use markdown, emojis, etc.)

You are helpful, friendly, and proactive. You can handle complex multi-step tasks.`;
  }

  /**
   * Process a message from Slack and return Claude's response
   */
  async processSlackMessage(user, message, channel, responseUrl) {
    try {
      console.log(`🤖 Processing message from ${user}: "${message}"`);
      
      // Build conversation context
      const messages = [
        {
          role: 'user',
          content: `[User: ${user} in channel: ${channel}]\n${message}`
        }
      ];
      
      // Create the message with tool use enabled
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.7,
        system: this.systemPrompt,
        messages: messages,
        tools: this.getMCPToolDefinitions(),
        tool_choice: { type: 'auto' }
      });
      
      // Process the response
      let finalResponse = '';
      let toolsUsed = [];
      
      // Handle tool use if Claude wants to use tools
      if (response.content) {
        for (const block of response.content) {
          if (block.type === 'text') {
            finalResponse += block.text;
          } else if (block.type === 'tool_use') {
            console.log(`🔧 Claude wants to use tool: ${block.name}`);
            
            // Execute the MCP tool
            const toolResult = await this.mcpExecutor.executeTool(
              block.name,
              block.input
            );
            
            toolsUsed.push({
              tool: block.name,
              result: toolResult
            });
            
            // Add tool result to the response
            if (toolResult.success) {
              finalResponse += `\n✅ ${block.name}: ${toolResult.message}`;
            } else {
              finalResponse += `\n❌ ${block.name} failed: ${toolResult.error}`;
            }
          }
        }
      }
      
      // Store conversation in memory for context
      await this.storeConversation(user, message, finalResponse);
      
      return {
        text: finalResponse || "I'm thinking...",
        toolsUsed: toolsUsed,
        usage: response.usage
      };
      
    } catch (error) {
      console.error('❌ Claude service error:', error);
      
      if (error.message?.includes('api_key')) {
        return {
          text: '❌ Claude API key not configured. Please set ANTHROPIC_API_KEY in .env file.',
          error: true
        };
      }
      
      return {
        text: `❌ Error: ${error.message}`,
        error: true
      };
    }
  }
  
  /**
   * Get MCP tool definitions for Claude
   */
  getMCPToolDefinitions() {
    // For now, start with a few key tools
    // We'll expand this based on your MCP configuration
    return [
      {
        name: 'search_web',
        description: 'Search the web for information',
        input_schema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'read_file',
        description: 'Read contents of a file',
        input_schema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the file'
            }
          },
          required: ['path']
        }
      },
      {
        name: 'send_notification',
        description: 'Send a mobile notification',
        input_schema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Notification title'
            },
            message: {
              type: 'string',
              description: 'Notification message'
            },
            priority: {
              type: 'string',
              enum: ['low', 'default', 'high', 'urgent'],
              description: 'Priority level'
            }
          },
          required: ['title', 'message']
        }
      },
      {
        name: 'create_ticket',
        description: 'Create a FreeScout support ticket',
        input_schema: {
          type: 'object',
          properties: {
            subject: {
              type: 'string',
              description: 'Ticket subject'
            },
            message: {
              type: 'string',
              description: 'Ticket message'
            },
            customer_email: {
              type: 'string',
              description: 'Customer email address'
            }
          },
          required: ['subject', 'message', 'customer_email']
        }
      }
    ];
  }
  
  /**
   * Store conversation in OpenMemory for context
   */
  async storeConversation(user, message, response) {
    try {
      // Store in memory using MCP
      await this.mcpExecutor.executeTool('add_memory', {
        content: `Slack conversation - User: ${user}, Message: "${message}", Response: "${response.substring(0, 500)}..."`
      });
    } catch (error) {
      console.log('Could not store in memory:', error.message);
    }
  }
}

export { ClaudeService };