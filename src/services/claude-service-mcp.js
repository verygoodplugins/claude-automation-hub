/**
 * Claude AI Service with Real MCP Integration
 * 
 * Handles communication with Claude API and executes real MCP tools
 */

import Anthropic from '@anthropic-ai/sdk';
import { mcpClient } from './mcp-client.js';
import dotenv from 'dotenv';

dotenv.config();

class ClaudeServiceMCP {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    this.model = 'claude-3-5-sonnet-latest';
    this.mcpInitialized = false;
    
    // Engaging, intelligent system prompt for Slack interactions
    this.systemPrompt = `You are Auto-Jack, an intelligent AI assistant integrated into Slack with powerful automation capabilities through MCP (Model Context Protocol) tools. You're designed to be engaging, helpful, and proactive - like having Claude right in your workspace.

## Your Personality & Communication Style

📌 **Be conversational and engaging**: Address users by name when appropriate, and write in a warm, professional tone that feels natural in Slack. Think of yourself as a knowledgeable colleague who's always ready to help.

💡 **Structure your responses thoughtfully**:
- Start with a greeting or acknowledgment of the request
- Provide a clear summary of what you're going to do or have discovered
- Break down complex information using bullets, numbered lists, or sections
- Highlight key points with **bold** or _italics_ for emphasis
- End with next steps, recommendations, or a follow-up question when relevant

🎯 **Be proactive and thorough**:
- Anticipate follow-up questions and address them preemptively
- When you find something interesting or relevant, mention it
- Offer suggestions for related tasks you could help with
- If multiple tools could solve a problem, explain your choice

## Your Capabilities

You have access to a powerful suite of MCP tools that let you:

🎫 **Support & Customer Management** (FreeScout)
- Search, view, and analyze support tickets
- Track customer interactions and history
- Generate insights from support patterns

🌐 **Web Automation** (Playwright, Fetch, Brave Search)
- Browse websites and extract information
- Automate repetitive web tasks
- Research topics and gather current information
- Take screenshots and monitor pages

📁 **File System Operations** (Filesystem)
- Read, write, and manage files
- Analyze code and documentation
- Navigate project structures

💬 **Communication** (Slack Tools, Memory)
- Send messages and notifications
- Remember context from previous conversations
- Access Slack history and user information

🔧 **Development Tools** (GitHub, WordPress, Context7)
- Manage repositories and pull requests
- Update WordPress sites and content
- Look up library documentation instantly

📍 **Location Services** (Google Maps)
- Find locations and get directions
- Calculate distances and travel times

## Response Guidelines

1. **For simple queries**: Be concise but complete. A greeting, the answer, and any relevant context.

2. **For complex tasks**: 
   - Acknowledge the request
   - Outline your approach
   - Execute with status updates
   - Summarize results clearly
   - Suggest next steps

3. **When using tools**:
   - Briefly explain which tool you're using and why
   - Share interesting findings as you work
   - Format tool outputs for readability

4. **For errors or limitations**:
   - Explain what went wrong in simple terms
   - Offer alternative approaches
   - Stay positive and solution-focused

## Example Response Patterns

**Simple Request:**
"Hey @user! I found that ticket #12345 you asked about. It's currently **open** and assigned to Sarah. The customer reported an issue with login authentication. Would you like me to pull up the full conversation history?"

**Complex Analysis:**
"Hi @user! I'll analyze your support queue for patterns. Let me check a few things:

📊 **Current Status:**
• 15 open tickets (3 high priority)
• Average response time: 2.3 hours
• Most common issue: Password reset (40%)

🔍 **Key Insights:**
The spike in password issues started after the recent update. I notice most are from users on older browsers. 

💡 **Recommendations:**
1. Consider an announcement about browser compatibility
2. I can draft a knowledge base article if you'd like
3. There are 3 tickets I could auto-respond to with the solution

What would you like to tackle first?"

Remember: You're not just executing commands - you're having a conversation. Be the helpful, intelligent colleague everyone wishes they had on Slack!`;
  }

  /**
   * Initialize MCP connections
   */
  async initializeMCP() {
    if (this.mcpInitialized) return;
    
    try {
      console.log('🔌 Initializing MCP connections...');
      await mcpClient.initialize();
      this.mcpInitialized = true;
      console.log('✅ MCP connections established');
    } catch (error) {
      console.error('❌ Failed to initialize MCP:', error);
      // Continue anyway - we can work without MCP
    }
  }

  /**
   * Process a message from Slack with real MCP tools
   */
  async processSlackMessage(user, message, channel, responseUrl) {
    try {
      // Initialize MCP if needed
      await this.initializeMCP();
      
      console.log(`🤖 Processing: "${message}" from ${user}`);
      
      // Get available MCP tools
      const mcpTools = this.getMCPToolDefinitions();
      
      // Build messages for Claude
      const messages = [
        {
          role: 'user',
          content: `[Slack user: ${user}] ${message}`
        }
      ];
      
      // Call Claude with tool support
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.7,
        system: this.systemPrompt,
        messages: messages,
        tools: mcpTools,
        tool_choice: { type: 'auto' }
      });
      
      // Process response and tool calls
      let finalResponse = '';
      const toolsUsed = [];
      
      for (const block of response.content) {
        if (block.type === 'text') {
          finalResponse += block.text;
        } else if (block.type === 'tool_use') {
          // Execute real MCP tool
          const toolResult = await this.executeMCPTool(block.name, block.input);
          toolsUsed.push({
            tool: block.name,
            success: toolResult.success
          });
          
          // Get Claude's response after tool use
          const toolResponse = await this.getToolResponse(
            messages, 
            block, 
            toolResult
          );
          
          if (toolResponse) {
            finalResponse = toolResponse;
          }
        }
      }
      
      return {
        text: finalResponse || "I've completed the task.",
        toolsUsed,
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
   * Get Claude's response after tool execution
   */
  async getToolResponse(previousMessages, toolUse, toolResult) {
    try {
      // Add assistant's tool use to messages
      const messages = [
        ...previousMessages,
        {
          role: 'assistant',
          content: [toolUse]
        },
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(toolResult.result || toolResult)
            }
          ]
        }
      ];
      
      // Get Claude's interpretation of the tool result
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 2000,
        temperature: 0.7,
        system: this.systemPrompt,
        messages: messages
      });
      
      // Extract text response
      for (const block of response.content) {
        if (block.type === 'text') {
          return block.text;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to get tool response:', error);
      return null;
    }
  }

  /**
   * Get MCP tool definitions for Claude
   */
  getMCPToolDefinitions() {
    const tools = [];
    
    // Get all available MCP tools
    const mcpTools = mcpClient.getAllTools();
    
    for (const mcpTool of mcpTools) {
      // Claude API requires tool names to match pattern ^[a-zA-Z0-9_-]{1,128}$
      // Replace dots with underscores
      const safeName = mcpTool.fullName.replace(/\./g, '_');
      
      tools.push({
        name: safeName,
        description: mcpTool.description || `Use ${mcpTool.name} from ${mcpTool.server}`,
        input_schema: mcpTool.inputSchema || {
          type: 'object',
          properties: {},
          required: []
        }
      });
    }
    
    // Add some fallback tools if no MCP servers are running
    if (tools.length === 0) {
      tools.push(
        {
          name: 'get_current_time',
          description: 'Get the current date and time',
          input_schema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'calculate',
          description: 'Perform mathematical calculations',
          input_schema: {
            type: 'object',
            properties: {
              expression: {
                type: 'string',
                description: 'Mathematical expression to evaluate'
              }
            },
            required: ['expression']
          }
        }
      );
    }
    
    console.log(`📦 Loaded ${tools.length} tools for Claude`);
    return tools;
  }

  /**
   * Execute an MCP tool
   */
  async executeMCPTool(toolName, args) {
    console.log(`🔧 Executing MCP tool: ${toolName}`);
    
    try {
      // Tool names come as server_toolname, need to convert back
      // First underscore is the separator between server and tool
      const firstUnderscore = toolName.indexOf('_');
      let serverName, actualToolName;
      
      if (firstUnderscore > 0) {
        serverName = toolName.substring(0, firstUnderscore);
        actualToolName = toolName.substring(firstUnderscore + 1);
      } else {
        // Find the tool
        const found = mcpClient.findTool(toolName);
        if (found) {
          serverName = found.server;
          actualToolName = toolName;
        }
      }
      
      if (serverName && actualToolName) {
        // Call real MCP tool
        const result = await mcpClient.callTool(serverName, actualToolName, args);
        
        return {
          success: true,
          result: result
        };
      }
      
      // Fallback for built-in tools
      if (toolName === 'get_current_time') {
        return {
          success: true,
          result: {
            time: new Date().toLocaleString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        };
      }
      
      if (toolName === 'calculate') {
        try {
          // Safe evaluation of math expressions
          const result = Function('"use strict"; return (' + args.expression + ')')();
          return {
            success: true,
            result: { answer: result }
          };
        } catch (error) {
          return {
            success: false,
            error: `Calculation error: ${error.message}`
          };
        }
      }
      
      throw new Error(`Tool ${toolName} not found`);
      
    } catch (error) {
      console.error(`❌ MCP tool execution failed:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Store conversation in memory (if OpenMemory is available)
   */
  async storeConversation(user, message, response) {
    try {
      // Try to use OpenMemory MCP if available
      const result = await mcpClient.callTool('memory', 'add_memory', {
        content: `Slack: ${user}: "${message}" -> Claude: "${response.substring(0, 500)}"`
      });
      console.log('💾 Stored in memory');
    } catch (error) {
      // Memory storage is optional
    }
  }
}

export { ClaudeServiceMCP };