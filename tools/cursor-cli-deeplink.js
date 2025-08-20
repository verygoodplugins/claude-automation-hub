import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export default {
  name: "cursor_cli_deeplink",
  description: "Open files in Cursor with optional line numbers and agent prompts. Supports both opening files and running headless agent commands.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["open", "agent", "status"],
        description: "Action to perform: 'open' (open file/project), 'agent' (run headless agent), 'status' (check CLI status)"
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
    print = true 
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
