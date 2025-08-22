/**
 * MCP Tool Executor
 * 
 * Executes MCP tools on behalf of Claude
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

class MCPExecutor {
  constructor() {
    // Map tool names to execution methods
    this.tools = {
      'search_web': this.searchWeb.bind(this),
      'read_file': this.readFile.bind(this),
      'write_file': this.writeFile.bind(this),
      'send_notification': this.sendNotification.bind(this),
      'create_ticket': this.createTicket.bind(this),
      'run_command': this.runCommand.bind(this),
      'add_memory': this.addMemory.bind(this),
      'search_memory': this.searchMemory.bind(this),
      'get_calendar': this.getCalendar.bind(this),
      'create_reminder': this.createReminder.bind(this),
      'git_status': this.gitStatus.bind(this),
      'git_commit': this.gitCommit.bind(this),
      'take_screenshot': this.takeScreenshot.bind(this),
      'open_url': this.openUrl.bind(this)
    };
    
    // Security: Define which tools require approval
    this.dangerousTools = ['run_command', 'write_file', 'git_commit'];
  }
  
  /**
   * Execute a tool by name with parameters
   */
  async executeTool(toolName, params) {
    console.log(`🔧 Executing tool: ${toolName}`, params);
    
    // Check if tool exists
    if (!this.tools[toolName]) {
      return {
        success: false,
        error: `Unknown tool: ${toolName}`
      };
    }
    
    // Check if tool is dangerous and needs approval
    if (this.dangerousTools.includes(toolName)) {
      console.log(`⚠️ Dangerous tool ${toolName} - would need approval in production`);
      // In production, you'd send an approval request to Slack here
    }
    
    try {
      const result = await this.tools[toolName](params);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      console.error(`❌ Tool ${toolName} failed:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Tool implementations
  
  async searchWeb({ query }) {
    // For now, return a mock result
    // In production, integrate with web search MCP
    return {
      message: `Searched for: "${query}"`,
      results: [
        { title: 'Example result 1', url: 'https://example.com/1' },
        { title: 'Example result 2', url: 'https://example.com/2' }
      ]
    };
  }
  
  async readFile({ path }) {
    try {
      const content = await fs.readFile(path, 'utf8');
      return {
        message: `Read file: ${path}`,
        content: content.substring(0, 1000) // Limit response size
      };
    } catch (error) {
      throw new Error(`Could not read file: ${error.message}`);
    }
  }
  
  async writeFile({ path, content }) {
    try {
      await fs.writeFile(path, content, 'utf8');
      return {
        message: `Wrote ${content.length} characters to ${path}`
      };
    } catch (error) {
      throw new Error(`Could not write file: ${error.message}`);
    }
  }
  
  async sendNotification({ title, message, priority = 'default' }) {
    const ntfyTopic = process.env.NTFY_TOPIC;
    if (!ntfyTopic) {
      throw new Error('NTFY_TOPIC not configured');
    }
    
    try {
      const response = await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: 'POST',
        body: message,
        headers: {
          'Title': title,
          'Priority': priority,
          'Tags': 'robot,slack'
        }
      });
      
      if (response.ok) {
        return {
          message: `📱 Notification sent: "${title}"`
        };
      } else {
        throw new Error(`NTFY returned ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Could not send notification: ${error.message}`);
    }
  }
  
  async createTicket({ subject, message, customer_email }) {
    // Mock implementation - would integrate with FreeScout MCP
    return {
      message: `Created ticket: "${subject}" for ${customer_email}`,
      ticketId: `TICKET-${Date.now()}`
    };
  }
  
  async runCommand({ command }) {
    // Security: Only allow safe commands
    const allowedCommands = ['ls', 'pwd', 'date', 'whoami', 'git status'];
    const baseCommand = command.split(' ')[0];
    
    if (!allowedCommands.includes(baseCommand)) {
      throw new Error(`Command not allowed: ${baseCommand}`);
    }
    
    try {
      const { stdout, stderr } = await execAsync(command);
      return {
        message: `Executed: ${command}`,
        output: stdout || stderr
      };
    } catch (error) {
      throw new Error(`Command failed: ${error.message}`);
    }
  }
  
  async addMemory({ content }) {
    // Mock implementation - would use OpenMemory MCP
    console.log('📝 Storing in memory:', content.substring(0, 100));
    return {
      message: 'Stored in memory'
    };
  }
  
  async searchMemory({ query }) {
    // Mock implementation
    return {
      message: `Searched memory for: "${query}"`,
      results: []
    };
  }
  
  async getCalendar({ date }) {
    // Mock implementation - would use Apple Calendar MCP
    return {
      message: `Calendar for ${date || 'today'}`,
      events: [
        { time: '10:00 AM', title: 'Team meeting' },
        { time: '2:00 PM', title: 'Client call' }
      ]
    };
  }
  
  async createReminder({ title, due }) {
    // Mock implementation - would use Apple Reminders MCP
    return {
      message: `Created reminder: "${title}" due ${due || 'soon'}`
    };
  }
  
  async gitStatus() {
    try {
      const { stdout } = await execAsync('git status --short');
      return {
        message: 'Git status',
        output: stdout || 'Working tree clean'
      };
    } catch (error) {
      throw new Error(`Git status failed: ${error.message}`);
    }
  }
  
  async gitCommit({ message }) {
    // Mock for safety - would need approval in production
    return {
      message: `Would commit with message: "${message}"`
    };
  }
  
  async takeScreenshot() {
    // Mock implementation - would use Playwright MCP
    return {
      message: 'Screenshot taken',
      path: '/tmp/screenshot.png'
    };
  }
  
  async openUrl({ url }) {
    // Mock implementation - would use Playwright MCP
    return {
      message: `Opened URL: ${url}`
    };
  }
}

export { MCPExecutor };