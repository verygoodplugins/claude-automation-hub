/**
 * Subagent Manager - Orchestrates parallel task execution
 * Reduces context window usage and improves code quality through specialization
 */

import { subagentDefinitions, routeToSubagent } from './subagent-definitions.js';

export class SubagentManager {
  constructor(hub) {
    this.hub = hub;
    this.activeTasks = new Map();
    this.completedTasks = new Map();
    this.taskQueue = [];
  }

  /**
   * Decompose a complex task into parallel subagent tasks
   */
  decomposeTask(mainTask, options = {}) {
    const subtasks = [];
    
    // Analyze task to identify independent components
    const components = this.identifyComponents(mainTask);
    
    components.forEach(component => {
      const subagentType = routeToSubagent(component.description);
      subtasks.push({
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: subagentType,
        description: component.description,
        dependencies: component.dependencies || [],
        priority: component.priority || 'normal',
        context: this.buildContext(subagentType),
        prompt: this.buildPrompt(component, subagentType)
      });
    });
    
    return subtasks;
  }

  /**
   * Identify independent components in a task
   */
  identifyComponents(task) {
    const components = [];
    
    // Common patterns for task decomposition
    const patterns = [
      { regex: /test|validat/i, type: 'testing' },
      { regex: /document|readme/i, type: 'documentation' },
      { regex: /notif|alert/i, type: 'notification' },
      { regex: /schedule|cron/i, type: 'scheduling' },
      { regex: /analyz|metric/i, type: 'metrics' },
      { regex: /implement|create|build/i, type: 'implementation' },
      { regex: /fix|debug|troubleshoot/i, type: 'debugging' },
      { regex: /optimize|improve|enhance/i, type: 'optimization' }
    ];
    
    // Parse task for different components
    patterns.forEach(pattern => {
      if (pattern.regex.test(task)) {
        components.push({
          description: `${pattern.type} component: ${task}`,
          priority: pattern.type === 'debugging' ? 'high' : 'normal',
          dependencies: []
        });
      }
    });
    
    // If no specific patterns found, treat as single component
    if (components.length === 0) {
      components.push({
        description: task,
        priority: 'normal',
        dependencies: []
      });
    }
    
    return components;
  }

  /**
   * Build context for subagent based on its type
   */
  buildContext(subagentType) {
    const definition = subagentDefinitions[subagentType];
    if (!definition) return '';
    
    return `
You are a specialized subagent focused on: ${definition.description}

Your capabilities:
${definition.capabilities.map(cap => `- ${cap}`).join('\n')}

Relevant files/patterns: ${definition.context}

Available tools: ${definition.tools.join(', ')}

Focus only on your specialized area. Return concise, actionable results.
`;
  }

  /**
   * Build prompt for subagent task
   */
  buildPrompt(component, subagentType) {
    return `
${this.buildContext(subagentType)}

Task: ${component.description}

Requirements:
1. Complete the task efficiently using minimal context
2. Return structured results that can be integrated
3. Include any errors or blockers encountered
4. Suggest follow-up tasks if needed

Output format:
- Status: completed/blocked/partial
- Result: <your implementation or findings>
- Errors: <any issues encountered>
- Next steps: <suggested follow-up tasks>
`;
  }

  /**
   * Spawn subagents for parallel execution
   */
  async spawnSubagents(tasks, options = {}) {
    const { maxParallel = 3, timeout = 300000 } = options;
    
    // Group tasks by dependencies
    const independentTasks = tasks.filter(t => t.dependencies.length === 0);
    const dependentTasks = tasks.filter(t => t.dependencies.length > 0);
    
    // Execute independent tasks in parallel (respecting maxParallel limit)
    const batches = [];
    for (let i = 0; i < independentTasks.length; i += maxParallel) {
      batches.push(independentTasks.slice(i, i + maxParallel));
    }
    
    const results = [];
    
    for (const batch of batches) {
      const batchPromises = batch.map(task => 
        this.executeSubagentTask(task, timeout)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
      
      // Store completed tasks
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          this.completedTasks.set(batch[index].id, result.value);
        }
      });
    }
    
    // Execute dependent tasks after their dependencies complete
    for (const task of dependentTasks) {
      const canExecute = task.dependencies.every(dep => 
        this.completedTasks.has(dep)
      );
      
      if (canExecute) {
        const result = await this.executeSubagentTask(task, timeout);
        results.push({ status: 'fulfilled', value: result });
        this.completedTasks.set(task.id, result);
      } else {
        results.push({ 
          status: 'rejected', 
          reason: `Dependencies not met: ${task.dependencies.join(', ')}` 
        });
      }
    }
    
    return this.aggregateResults(results);
  }

  /**
   * Execute a single subagent task
   */
  async executeSubagentTask(task, timeout) {
    this.activeTasks.set(task.id, {
      ...task,
      startTime: Date.now(),
      status: 'running'
    });
    
    try {
      // This would call the actual Task tool with the subagent
      // For now, returning a mock structure
      const result = {
        taskId: task.id,
        type: task.type,
        status: 'completed',
        result: `Executed ${task.type} subagent for: ${task.description}`,
        duration: Math.random() * 5000,
        contextUsed: Math.floor(Math.random() * 1000)
      };
      
      this.activeTasks.delete(task.id);
      return result;
      
    } catch (error) {
      this.activeTasks.delete(task.id);
      throw error;
    }
  }

  /**
   * Aggregate results from multiple subagents
   */
  aggregateResults(results) {
    const summary = {
      total: results.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      totalContextUsed: 0,
      totalDuration: 0,
      results: []
    };
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        summary.totalContextUsed += result.value.contextUsed || 0;
        summary.totalDuration += result.value.duration || 0;
        summary.results.push(result.value);
      } else {
        summary.results.push({
          status: 'failed',
          error: result.reason
        });
      }
    });
    
    return summary;
  }

  /**
   * Get status of all active tasks
   */
  getActiveTasksStatus() {
    const tasks = Array.from(this.activeTasks.values());
    return tasks.map(task => ({
      id: task.id,
      type: task.type,
      description: task.description,
      status: task.status,
      runningTime: Date.now() - task.startTime
    }));
  }

  /**
   * Cancel a running task
   */
  cancelTask(taskId) {
    if (this.activeTasks.has(taskId)) {
      this.activeTasks.delete(taskId);
      return true;
    }
    return false;
  }
}