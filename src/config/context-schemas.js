/**
 * Mobile MCP Context Schemas
 * Standardized data structures for cross-device AI workflows
 */

export const ContextSchemas = {
  
  /**
   * Base handoff context structure
   */
  baseHandoff: {
    id: 'string',              // handoff-{type}-{timestamp}
    type: 'string',            // event type
    timestamp: 'string',       // ISO timestamp
    desktopContext: 'object',  // what happened on desktop
    mobileActions: 'object',   // what can be done on mobile
    queryContext: 'object',    // optimized for mobile queries
    expiresAt: 'string',       // ISO timestamp
    priority: 'string',        // max, high, default, low
    metadata: 'object'         // source, version, etc.
  },

  /**
   * Meeting change event schema
   */
  meetingChange: {
    type: 'meeting-cancelled|meeting-moved|meeting-rescheduled',
    meeting: {
      title: 'string',
      originalTime: 'string',
      newTime: 'string|null',
      duration: 'string',       // "30min", "1h", etc.
      attendees: 'array',
      location: 'string',
      meetingType: 'string'     // "standup", "review", "client-call"
    },
    impact: {
      freedTime: 'string',      // amount of time freed up
      affectedTasks: 'array',   // tasks that can now be moved
      opportunities: 'array'    // what can be done with freed time
    },
    context: {
      currentWorkload: 'string',
      nextMeeting: 'string',
      deadlines: 'array'
    }
  },

  /**
   * End of day report schema
   */
  endOfDay: {
    summary: {
      workflowsCompleted: 'number',
      tasksFinished: 'number',
      timeHoursSaved: 'number',
      keyAchievements: 'array'
    },
    tomorrow: {
      topPriorities: 'array',
      scheduledMeetings: 'array',
      deadlines: 'array',
      prepNeeded: 'array'
    },
    insights: {
      productivityScore: 'number',
      focusAreas: 'array',
      recommendations: 'array'
    },
    urgentItems: {
      emails: 'number',
      tasks: 'array',
      reminders: 'array'
    }
  },

  /**
   * Urgent task/email schema
   */
  urgentItem: {
    type: 'email|task|message|alert',
    source: 'string',           // email, slack, calendar, etc.
    sender: 'string',
    subject: 'string',
    urgencyLevel: 'number',     // 1-10
    deadline: 'string',
    summary: 'string',
    context: {
      relatedProject: 'string',
      stakeholders: 'array',
      impact: 'string'
    },
    suggestedActions: 'array'
  },

  /**
   * Workflow completion schema
   */
  workflowComplete: {
    workflowName: 'string',
    startTime: 'string',
    endTime: 'string',
    duration: 'string',
    results: {
      filesCreated: 'array',
      tasksCompleted: 'array',
      dataProcessed: 'object',
      outputs: 'object'
    },
    nextSteps: 'array',
    requiresReview: 'boolean',
    stakeholders: 'array'
  }
};

/**
 * Mobile-optimized query patterns
 */
export const MobileQueryPatterns = {
  
  /**
   * Current context queries
   */
  currentContext: [
    'What\'s my current work context?',
    'What am I working on right now?',
    'What are my immediate priorities?',
    'What should I focus on?'
  ],

  /**
   * Recent changes queries
   */
  recentChanges: [
    'What changed in my schedule today?',
    'Any urgent items I need to know about?',
    'What notifications do I have?',
    'Did anything important happen while I was away?'
  ],

  /**
   * Available actions queries
   */
  availableActions: [
    'What can I do from my phone right now?',
    'What tasks can I handle remotely?',
    'Can I respond to anything urgent from mobile?',
    'What\'s the most important thing I can do now?'
  ],

  /**
   * Time-based queries
   */
  timeBasedQueries: [
    'How much free time do I have?',
    'When is my next meeting?',
    'What\'s coming up this afternoon?',
    'Do I have time for a quick task?'
  ],

  /**
   * Handoff-specific queries
   */
  handoffQueries: [
    'What handoffs are waiting for me?',
    'What context did desktop Claude prepare?',
    'What actions are recommended for this situation?',
    'Show me the full context for handoff {handoffId}'
  ]
};

/**
 * Context validation helpers
 */
export class ContextValidator {
  
  static validateHandoff(context) {
    const required = ['id', 'type', 'timestamp', 'desktopContext'];
    const missing = required.filter(field => !context[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  static validateMobileActions(actions) {
    if (typeof actions !== 'object') {
      throw new Error('Mobile actions must be an object');
    }
    
    for (const [key, value] of Object.entries(actions)) {
      if (typeof value !== 'string') {
        throw new Error(`Action ${key} must have string description`);
      }
      if (value.length > 50) {
        console.warn(`Action ${key} description is long (${value.length} chars)`);
      }
    }
    
    return true;
  }

  static validatePriority(priority) {
    const validPriorities = ['max', 'high', 'default', 'low'];
    if (!validPriorities.includes(priority)) {
      throw new Error(`Invalid priority: ${priority}. Must be one of: ${validPriorities.join(', ')}`);
    }
    return true;
  }

  static sanitizeForMobile(data) {
    // Remove or truncate data that's not mobile-friendly
    const sanitized = { ...data };
    
    // Truncate long strings
    if (sanitized.summary && sanitized.summary.length > 200) {
      sanitized.summary = sanitized.summary.substring(0, 197) + '...';
    }
    
    // Limit array sizes
    if (sanitized.actions && sanitized.actions.length > 5) {
      sanitized.actions = sanitized.actions.slice(0, 5);
    }
    
    // Remove sensitive data
    delete sanitized.apiKeys;
    delete sanitized.passwords;
    delete sanitized.tokens;
    
    return sanitized;
  }
}

/**
 * Mobile-ready formatting helpers
 */
export class MobileFormatter {
  
  static formatTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  static formatDuration(minutes) {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    if (remainingMins === 0) return `${hours}h`;
    return `${hours}h ${remainingMins}min`;
  }

  static formatPriority(priority) {
    const emojis = {
      max: '🚨',
      high: '🔥',
      default: '📋',
      low: '💡'
    };
    return `${emojis[priority] || '📋'} ${priority.toUpperCase()}`;
  }

  static formatSummaryForNotification(data, maxLength = 100) {
    let summary = data.summary || data.title || 'Update available';
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength - 3) + '...';
    }
    return summary;
  }

  static formatActionList(actions) {
    return Object.entries(actions)
      .map(([key, description]) => `• ${description}`)
      .join('\n');
  }
}
