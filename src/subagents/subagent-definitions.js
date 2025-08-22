/**
 * Subagent Definitions for Automation Hub
 * Each subagent specializes in specific domains to reduce context and improve quality
 */

export const subagentDefinitions = {
  // Workflow-specific subagents
  'workflow-analyzer': {
    description: 'Analyzes and optimizes workflow definitions',
    capabilities: [
      'Parse workflow markdown files',
      'Identify workflow dependencies',
      'Calculate time savings metrics',
      'Suggest workflow improvements',
      'Validate MCP tool requirements'
    ],
    context: 'workflows/**/*.md',
    tools: ['Read', 'Grep', 'MultiEdit', 'WebSearch']
  },

  'mcp-integration-specialist': {
    description: 'Handles MCP server integrations and tool development',
    capabilities: [
      'Create new MCP tool implementations',
      'Debug MCP connectivity issues',
      'Test tool handlers',
      'Optimize tool performance',
      'Document tool schemas'
    ],
    context: 'tools/*.js, config/mcp-*.json',
    tools: ['Read', 'Write', 'Bash', 'Task']
  },

  'notification-manager': {
    description: 'Manages mobile notifications and bundling logic',
    capabilities: [
      'Send NTFY notifications',
      'Optimize bundling strategies',
      'Handle priority routing',
      'Store context for mobile handoffs',
      'Test notification delivery'
    ],
    context: 'src/notifications/*, tools/ntfy-*.js',
    tools: ['Read', 'Edit', 'Bash', 'mcp__openmemory__*']
  },

  'scheduler-optimizer': {
    description: 'Manages and optimizes automated scheduling',
    capabilities: [
      'Configure workflow schedules',
      'Monitor execution patterns',
      'Identify scheduling conflicts',
      'Optimize timing for efficiency',
      'Handle timezone conversions'
    ],
    context: 'src/scheduler/*, workflows/daily/*',
    tools: ['Read', 'Edit', 'Bash', 'TodoWrite']
  },

  'testing-specialist': {
    description: 'Runs comprehensive tests and validates implementations',
    capabilities: [
      'Execute test suites',
      'Create test workflows',
      'Validate tool outputs',
      'Performance benchmarking',
      'Integration testing'
    ],
    context: 'test/*.js, test-*.js',
    tools: ['Bash', 'Read', 'Write', 'mcp__playwright__*']
  },

  'documentation-curator': {
    description: 'Maintains and updates project documentation',
    capabilities: [
      'Update README files',
      'Generate API documentation',
      'Create workflow guides',
      'Document time savings',
      'Maintain CHANGELOG'
    ],
    context: 'docs/*.md, README.md, CHANGELOG.md',
    tools: ['Read', 'MultiEdit', 'WebFetch']
  },

  'metrics-analyst': {
    description: 'Analyzes usage patterns and generates insights',
    capabilities: [
      'Calculate time savings',
      'Track workflow execution',
      'Generate usage reports',
      'Identify automation opportunities',
      'Monitor error rates'
    ],
    context: 'tools/hub-stats.js, workflows/**/metrics.json',
    tools: ['Read', 'Bash', 'mcp__openmemory__*']
  }
};

/**
 * Task routing logic - determines which subagent to use
 */
export function routeToSubagent(task) {
  const taskLower = task.toLowerCase();
  
  // Workflow-related tasks
  if (taskLower.includes('workflow') || taskLower.includes('automat')) {
    return 'workflow-analyzer';
  }
  
  // MCP and tool development
  if (taskLower.includes('mcp') || taskLower.includes('tool') || taskLower.includes('handler')) {
    return 'mcp-integration-specialist';
  }
  
  // Notification tasks
  if (taskLower.includes('notif') || taskLower.includes('ntfy') || taskLower.includes('mobile')) {
    return 'notification-manager';
  }
  
  // Scheduling tasks
  if (taskLower.includes('schedul') || taskLower.includes('cron') || taskLower.includes('timer')) {
    return 'scheduler-optimizer';
  }
  
  // Testing tasks
  if (taskLower.includes('test') || taskLower.includes('validat') || taskLower.includes('benchmark')) {
    return 'testing-specialist';
  }
  
  // Documentation tasks
  if (taskLower.includes('doc') || taskLower.includes('readme') || taskLower.includes('guide')) {
    return 'documentation-curator';
  }
  
  // Metrics and analytics
  if (taskLower.includes('metric') || taskLower.includes('stat') || taskLower.includes('analyz')) {
    return 'metrics-analyst';
  }
  
  // Default to general-purpose
  return 'general-purpose';
}