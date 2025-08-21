import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const execAsync = promisify(exec);

// Detect if running in Claude Desktop's MCP environment (check at runtime)
function isMcpEnvironment() {
  return process.env.MCP_SERVER_NAME === 'automation-hub' || 
         process.env.NODE_ENV === 'production' ||
         process.argv.some(arg => arg.includes('mcp-reloader'));
}

// Auto-start web proxy if not running (disabled in MCP environment)
async function ensureProxyRunning(port = 8765, customUrl = null) {
  try {
    // Quick health check
    const fetch = (await import('node-fetch')).default;
    const healthUrl = customUrl ? `${customUrl}/health` : `http://localhost:${port}/health`;
    await fetch(healthUrl, { timeout: 1000 });
    return true; // Proxy is already running
  } catch (error) {
    // In MCP environment, don't auto-start - return clear error
    if (isMcpEnvironment()) {
      throw new Error(`Cursor proxy not running at localhost:${port}. Please start manually: npm run proxy`);
    }
    
    // Standalone mode: start proxy automatically
    console.log(`🚀 Starting web proxy on port ${port}...`);
    
    const { spawn } = await import('child_process');
    const proxyPath = path.join(PROJECT_ROOT, 'cursor-web-proxy.js');
    const proxy = spawn('node', [proxyPath], {
      stdio: ['ignore', 'ignore', 'ignore'],
      detached: true,
      cwd: PROJECT_ROOT
    });
    
    proxy.unref(); // Don't keep process alive
    
    // Wait a moment for startup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify it started
    try {
      await fetch(`http://localhost:${port}/health`, { timeout: 2000 });
      console.log(`✅ Web proxy started successfully on port ${port}`);
      return true;
    } catch (startupError) {
      console.log(`❌ Failed to start web proxy: ${startupError.message}`);
      return false;
    }
  }
}

export default {
  name: "cursor_cli_deeplink",
  description: "Open files in Cursor with optional line numbers and agent prompts. Supports both opening files and running headless agent commands.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["open", "agent", "status", "generate_link"],
        description: "Action to perform: 'open' (open file/project), 'agent' (run headless agent), 'status' (check CLI status), 'generate_link' (create clickable link)"
      },
      projectPath: {
        type: "string",
        description: "Path to project directory (for opening projects or running agent commands)"
      },
      filePath: {
        type: "string",
        description: "Path to specific file to open (relative to project or absolute)"
      },
      lineNumber: {
        type: "number",
        description: "Line number to jump to in the file"
      },
      columnNumber: {
        type: "number",
        description: "Column number to jump to (optional)"
      },
      prompt: {
        type: "string",
        description: "Agent prompt to run (for 'agent' action)"
      },
      model: {
        type: "string",
        description: "Model to use for agent (e.g., 'claude-3-5-sonnet-20241022')",
        default: process.env.CURSOR_DEFAULT_MODEL || "claude-3-5-sonnet-20241022"
      },
      background: {
        type: "boolean",
        description: "Start in background mode",
        default: false
      },
      print: {
        type: "boolean",
        description: "Print agent responses to console (for headless mode)",
        default: true
      },
      title: {
        type: "string",
        description: "Title for the clickable link (for generate_link action)"
      }
    },
    required: ["action"]
  },
  handler: async ({ 
    action, 
    projectPath, 
    filePath, 
    lineNumber, 
    columnNumber, 
    prompt, 
    model, 
    background = false, 
    print = true,
    title
  }) => {
    try {
      // Check if cursor CLI is available
      try {
        await execAsync('which cursor');
      } catch (error) {
        return {
          success: false,
          error: "Cursor CLI not found. Install with: brew install --cask cursor-cli",
          help: "Visit https://docs.cursor.com/en/cli/reference/parameters for setup instructions"
        };
      }

      let command = "";
      let workingDir = process.env.CURSOR_DEFAULT_PROJECT || process.cwd();

      try {
        switch (action) {
        case "status":
          command = "cursor-agent status";
          break;

        case "generate_link":
          // Create a clickable link via the web proxy
          if (!prompt) {
            return {
              success: false,
              error: "Prompt is required for generate_link action"
            };
          }

          try {
            // Check if web proxy is running, auto-start if needed
            const proxyPort = process.env.CURSOR_PROXY_PORT || 8765;
            
            // In MCP environment, try local machine IP if localhost fails
            let proxyUrl = `http://localhost:${proxyPort}`;
            if (isMcpEnvironment()) {
              // Try to get local IP for network-bound proxy
              try {
                const { networkInterfaces } = await import('os');
                const nets = networkInterfaces();
                const localIp = Object.values(nets)
                  .flat()
                  .find(net => net?.family === 'IPv4' && !net?.internal)?.address;
                
                if (localIp) {
                  proxyUrl = `http://${localIp}:${proxyPort}`;
                  console.log(`Using local IP for MCP: ${proxyUrl}`);
                }
              } catch (ipError) {
                console.log('Could not determine local IP, using localhost');
              }
            }
            
            // Auto-start proxy if not running (disabled in MCP mode)
            await ensureProxyRunning(proxyPort, proxyUrl);
            
            // Prepare task data
            const taskData = {
              projectPath: projectPath || workingDir,
              file: filePath,
              lineNumber,
              columnNumber,
              prompt,
              title: title || `Fix: ${filePath || 'Project'}`
            };

            // Register task with web proxy
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(`${proxyUrl}/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(taskData)
            });

            if (!response.ok) {
              const error = await response.text();
              return {
                success: false,
                error: `Web proxy error: ${error}`,
                help: `Try manually: npm run proxy`
              };
            }

            const result = await response.json();
            
            return {
              success: true,
              url: result.url,
              title: result.title,
              clickable: true,
              taskId: result.id,
              expiresAt: result.expiresAt,
              instructions: "Click the URL to open in Cursor with the AI prompt ready to paste"
            };

          } catch (error) {
            // Check if this is a proxy connection error in MCP environment
            const mcpEnv = isMcpEnvironment();
            const isMcpProxyError = mcpEnv && error.message.includes('Cursor proxy not running');
            
            return {
              success: false,
              error: error.message,
              help: isMcpProxyError 
                ? "Start the proxy server first: npm run proxy (must be running before using Claude Desktop)"
                : "Auto-start failed. Try manually: npm run proxy",
              autoStartAttempted: !mcpEnv,
              mcpEnvironment: mcpEnv,
              requiresManualProxy: mcpEnv,
              details: {
                projectPath: projectPath || workingDir,
                filePath,
                prompt: prompt ? `${prompt.substring(0, 100)}...` : undefined
              }
            };
          }

        case "open":
          if (!projectPath && !filePath) {
            return {
              success: false,
              error: "Either projectPath or filePath is required for 'open' action"
            };
          }

          // Build the cursor open command
          let targetPath = projectPath || filePath;
          
          // If we have both project and file, construct full path
          if (projectPath && filePath) {
            targetPath = path.isAbsolute(filePath) ? filePath : path.join(projectPath, filePath);
          }

          // Check if path exists
          if (!existsSync(targetPath)) {
            return {
              success: false,
              error: `Path does not exist: ${targetPath}`
            };
          }

          command = `cursor "${targetPath}"`;
          
          // Add line/column if specified and we're opening a file
          if ((lineNumber || columnNumber) && filePath) {
            const line = lineNumber || 1;
            const col = columnNumber || 1;
            command += `:${line}:${col}`;
          }

          if (background) {
            command += " --background";
          }

          break;

        case "agent":
          if (!prompt) {
            return {
              success: false,
              error: "Prompt is required for 'agent' action"
            };
          }

          // Set working directory if projectPath is provided
          if (projectPath) {
            if (!existsSync(projectPath)) {
              return {
                success: false,
                error: `Project path does not exist: ${projectPath}`
              };
            }
            workingDir = projectPath;
          }

          // Build cursor-agent command
          let agentFlags = [];
          
          if (print) agentFlags.push("-p");
          if (model) agentFlags.push(`-m "${model}"`);
          if (background) agentFlags.push("-b");

          command = `cursor-agent ${agentFlags.join(" ")} "${prompt}"`;
          break;

        default:
          return {
            success: false,
            error: `Unknown action: ${action}`
          };
        }

        // Execute the command
        const { stdout, stderr } = await execAsync(command, { 
          cwd: workingDir,
          timeout: 30000 // 30 second timeout
        });

        return {
          success: true,
          action,
          command: command,
          workingDir,
          output: stdout || stderr || "Command executed successfully",
          details: {
            projectPath,
            filePath,
            lineNumber,
            columnNumber,
            prompt: prompt ? `${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""}` : undefined
          }
        };

      } catch (error) {
        return {
          success: false,
          error: error.message,
          command: command || "unknown",
          help: "Check that Cursor CLI is properly installed and the paths exist"
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        help: "Check that Cursor CLI is properly installed and the paths exist"
      };
    }
  }
};
