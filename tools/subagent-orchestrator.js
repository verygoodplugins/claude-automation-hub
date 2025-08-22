/**
 * Subagent Orchestrator Tool
 * MCP tool for spawning and managing subagents from Claude
 */

import { SubagentManager } from '../src/subagents/subagent-manager.js';

let manager = null;

export default {
  name: "subagent_orchestrator",
  description: "Spawn and manage specialized subagents for parallel task execution",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["spawn", "status", "cancel", "decompose"],
        description: "Action to perform"
      },
      task: {
        type: "string",
        description: "Main task to decompose and execute (for spawn/decompose)"
      },
      taskId: {
        type: "string",
        description: "Task ID for status/cancel operations"
      },
      options: {
        type: "object",
        properties: {
          maxParallel: {
            type: "number",
            description: "Maximum parallel subagents (default: 3)"
          },
          timeout: {
            type: "number",
            description: "Timeout in milliseconds (default: 300000)"
          },
          autoExecute: {
            type: "boolean",
            description: "Automatically execute after decomposition (default: true)"
          }
        }
      }
    },
    required: ["action"]
  },
  
  handler: async ({ action, task, taskId, options = {} }) => {
    // Initialize manager if needed
    if (!manager) {
      manager = new SubagentManager();
    }
    
    switch (action) {
      case 'decompose':
        // Decompose task into subtasks
        const subtasks = manager.decomposeTask(task, options);
        
        if (options.autoExecute !== false) {
          // Automatically spawn subagents
          const results = await manager.spawnSubagents(subtasks, options);
          
          return {
            action: 'decompose_and_execute',
            originalTask: task,
            subtasks: subtasks.map(t => ({
              id: t.id,
              type: t.type,
              description: t.description,
              priority: t.priority
            })),
            executionResults: results,
            contextSaved: `${Math.round((1 - results.totalContextUsed / (subtasks.length * 5000)) * 100)}%`,
            timeSaved: `${Math.round(results.totalDuration / 1000)}s parallel vs ${Math.round(results.totalDuration * subtasks.length / 1000)}s sequential`
          };
        }
        
        return {
          action: 'decompose',
          originalTask: task,
          subtasks: subtasks.map(t => ({
            id: t.id,
            type: t.type,
            description: t.description,
            priority: t.priority,
            dependencies: t.dependencies
          })),
          recommendation: `Execute with 'spawn' action to run ${subtasks.length} parallel tasks`
        };
        
      case 'spawn':
        // Spawn subagents for a task
        const decomposed = manager.decomposeTask(task, options);
        const spawnResults = await manager.spawnSubagents(decomposed, options);
        
        return {
          action: 'spawn',
          task: task,
          results: spawnResults,
          efficiency: {
            parallelTasks: decomposed.length,
            contextPerTask: Math.round(spawnResults.totalContextUsed / decomposed.length),
            totalDuration: `${Math.round(spawnResults.totalDuration / 1000)}s`,
            successful: spawnResults.successful,
            failed: spawnResults.failed
          }
        };
        
      case 'status':
        // Get status of active tasks
        const activeTasks = manager.getActiveTasksStatus();
        
        if (taskId) {
          const task = activeTasks.find(t => t.id === taskId);
          return task || { error: `Task ${taskId} not found` };
        }
        
        return {
          action: 'status',
          activeTasks: activeTasks,
          summary: {
            total: activeTasks.length,
            running: activeTasks.filter(t => t.status === 'running').length,
            queued: activeTasks.filter(t => t.status === 'queued').length
          }
        };
        
      case 'cancel':
        // Cancel a running task
        if (!taskId) {
          return { error: 'Task ID required for cancel action' };
        }
        
        const cancelled = manager.cancelTask(taskId);
        return {
          action: 'cancel',
          taskId: taskId,
          cancelled: cancelled,
          message: cancelled ? 'Task cancelled successfully' : 'Task not found or already completed'
        };
        
      default:
        return { error: `Unknown action: ${action}` };
    }
  }
};