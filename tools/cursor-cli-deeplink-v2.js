#!/usr/bin/env node
/**
 * Enhanced Cursor CLI Deeplink MCP Tool
 * 
 * Generates universal clickable links that work in:
 * - Claude Desktop (as clickable text)
 * - Emails
 * - Browsers
 * - Any HTML context
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

// Configuration
const PROXY_URL = process.env.CURSOR_PROXY_URL || 'http://localhost:8765';

class CursorDeeplink {
  constructor() {
    this.name = 'cursor_cli_deeplink';
    this.description = 'Generate universal Cursor deeplinks or open files directly';
  }

  async run(args) {
    const { action = 'generate_link' } = args;

    switch (action) {
      case 'generate_link':
        return this.generateLink(args);
      
      case 'open':
        return this.openDirectly(args);
      
      case 'status':
        return this.checkStatus();
      
      case 'dashboard':
        return this.getDashboardUrl();
      
      default:
        return {
          success: false,
          error: `Unknown action: ${action}. Use 'generate_link', 'open', 'status', or 'dashboard'`
        };
    }
  }

  /**
   * Generate a universal clickable link
   * This is the main method for MCP integration
   */
  async generateLink(args) {
    const { projectPath, filePath, file, lineNumber, columnNumber, prompt, title } = args;
    
    // Validate inputs
    if (!projectPath) {
      return {
        success: false,
        error: 'projectPath is required'
      };
    }

    try {
      // Check if proxy is running
      const health = await this.checkProxyHealth();
      if (!health.running) {
        // Fallback: return cursor command
        const command = this.buildCursorCommand(args);
        return {
          success: false,
          error: 'Proxy not running',
          command,
          instructions: 'Start proxy with: npm run proxy in claude-automation-hub'
        };
      }

      // Register with proxy
      const response = await fetch(`${PROXY_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectPath,
          file: filePath || file,
          lineNumber,
          columnNumber,
          prompt,
          title: title || this.generateTitle(args)
        })
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          url: result.url,
          clickable: result.url,  // This makes it clickable in Claude
          markdown: result.markdown,
          html: result.html,
          expiresAt: result.expiresAt,
          message: `Click here to open in Cursor: ${result.url}`
        };
      } else {
        return {
          success: false,
          error: 'Failed to register task',
          details: result.error
        };
      }

    } catch (error) {
      // Fallback if proxy is not running
      const command = this.buildCursorCommand(args);
      return {
        success: false,
        error: `Proxy connection failed: ${error.message}`,
        command,
        instructions: 'Start proxy with: npm run proxy in claude-automation-hub'
      };
    }
  }

  /**
   * Open directly without generating a link
   * For backward compatibility
   */
  async openDirectly(args) {
    const command = this.buildCursorCommand(args);
    
    try {
      const { stdout, stderr } = await execAsync(command);
      return {
        success: true,
        action: 'open',
        command,
        output: stdout || 'Command executed successfully',
        details: args
      };
    } catch (error) {
      return {
        success: false,
        error: `Command failed: ${error.message}`,
        command,
        help: 'Check that Cursor CLI is installed and paths exist'
      };
    }
  }

  /**
   * Check proxy status
   */
  async checkStatus() {
    const health = await this.checkProxyHealth();
    
    if (health.running) {
      return {
        success: true,
        status: 'running',
        dashboardUrl: `${PROXY_URL}/dashboard`,
        health: health.data,
        message: `Proxy is running. Dashboard: ${PROXY_URL}/dashboard`
      };
    } else {
      return {
        success: false,
        status: 'not_running',
        error: health.error,
        instructions: 'Start proxy with: npm run proxy in claude-automation-hub'
      };
    }
  }

  /**
   * Get dashboard URL
   */
  getDashboardUrl() {
    return {
      success: true,
      url: `${PROXY_URL}/dashboard`,
      clickable: `${PROXY_URL}/dashboard`,
      message: `View dashboard at: ${PROXY_URL}/dashboard`
    };
  }

  /**
   * Helper: Build cursor command
   */
  buildCursorCommand(args) {
    const { projectPath, filePath, file, lineNumber, columnNumber } = args;
    
    let target = projectPath;
    if (filePath || file) {
      const fileName = filePath || file;
      target = fileName.startsWith('/') ? fileName : `${projectPath}/${fileName}`;
    }
    
    if (lineNumber) {
      target += `:${lineNumber}:${columnNumber || 1}`;
    }
    
    return `cursor "${target}"`;
  }

  /**
   * Helper: Generate title from args
   */
  generateTitle(args) {
    const { filePath, file, projectPath } = args;
    
    if (filePath || file) {
      const fileName = (filePath || file).split('/').pop();
      return `📄 ${fileName}`;
    }
    
    const projectName = projectPath.split('/').pop();
    return `📁 ${projectName}`;
  }

  /**
   * Helper: Check if proxy is running
   */
  async checkProxyHealth() {
    try {
      const response = await fetch(`${PROXY_URL}/health`, {
        timeout: 2000
      });
      const data = await response.json();
      return {
        running: true,
        data
      };
    } catch (error) {
      return {
        running: false,
        error: error.message
      };
    }
  }
}

// Export for MCP registration
export const tool = new CursorDeeplink();

// Schema for MCP
export const schema = {
  name: 'cursor_cli_deeplink',
  description: 'Generate universal Cursor deeplinks or open files directly',
  inputSchema: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['generate_link', 'open', 'status', 'dashboard'],
        description: 'Action to perform',
        default: 'generate_link'
      },
      projectPath: {
        type: 'string',
        description: 'Path to project directory'
      },
      filePath: {
        type: 'string',
        description: 'Path to specific file (relative or absolute)'
      },
      lineNumber: {
        type: 'number',
        description: 'Line number to jump to'
      },
      columnNumber: {
        type: 'number',
        description: 'Column number (optional)'
      },
      prompt: {
        type: 'string',
        description: 'AI prompt for Cursor'
      },
      title: {
        type: 'string',
        description: 'Title for the link'
      }
    }
  }
};

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = {
    action: process.argv[2] || 'status',
    projectPath: process.argv[3],
    filePath: process.argv[4]
  };
  
  tool.run(args).then(result => {
    console.log(JSON.stringify(result, null, 2));
  });
}
