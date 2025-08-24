/**
 * Context Bridge for Mobile MCP Handoffs
 * Manages rich context storage in MCP Memory Service for cross-device AI workflows
 */

export class ContextBridge {
  constructor(options = {}) {
    this.memoryClient = options.memoryClient;
    this.notificationManager = options.notificationManager;
    this.version = '1.0.0';
  }

  /**
   * Create a mobile handoff context
   * @param {string} eventType - Type of event requiring mobile attention
   * @param {Object} data - Rich context data
   * @param {Object} options - Additional options
   */
  async createMobileHandoff(eventType, data, options = {}) {
    try {
      const handoffId = `handoff-${eventType}-${Date.now()}`;
      
      // Build comprehensive context for mobile Claude
      const fullContext = {
        id: handoffId,
        type: eventType,
        timestamp: new Date().toISOString(),
        
        // Desktop context (what happened)
        desktopContext: {
          ...data,
          source: 'automation-hub',
          triggers: data.triggers || [],
          relatedWorkflows: data.relatedWorkflows || []
        },
        
        // Mobile actions (what can be done)
        mobileActions: this.generateMobileActions(eventType, data),
        
        // Context for queries
        queryContext: this.buildQueryContext(eventType, data),
        
        // Expiry and metadata
        expiresAt: new Date(Date.now() + (options.expiryHours || 24) * 60 * 60 * 1000).toISOString(),
        priority: options.priority || this.determinePriority(eventType),
        
        metadata: {
          source: 'claude-automation-hub',
          version: this.version,
          deviceInitiated: 'desktop',
          mobileReady: true,
          handoffCreated: new Date().toISOString()
        }
      };

      // Store in MCP Memory Service for mobile access
      if (this.memoryClient) {
        await this.storeInMemory(fullContext);
      }

      // Send notification
      if (this.notificationManager) {
        await this.notificationManager.sendContextualNotification(
          eventType,
          {
            title: data.title,
            summary: data.summary || this.generateSummary(eventType, data),
            handoffId: handoffId
          },
          this.generateNtfyActions(eventType)
        );
      }

      return { success: true, handoffId, context: fullContext };
    } catch (error) {
      console.error('Failed to create mobile handoff:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Store context in MCP Memory Service with structured tagging
   */
  async storeInMemory(context) {
    if (!this.memoryClient) {
      console.warn('No memory client configured');
      return;
    }

    const memoryEntry = {
      content: JSON.stringify(context, null, 2),
      tags: [
        'mobile-handoff',
        context.type,
        `priority-${context.priority}`,
        'automation-hub',
        `handoff-${context.id}`
      ],
      metadata: {
        handoffId: context.id,
        type: context.type,
        timestamp: context.timestamp,
        mobileReady: true
      }
    };

    // Store the main context
    await this.memoryClient.store(memoryEntry);

    // Store searchable summary for easy mobile queries
    const summaryEntry = {
      content: `Mobile handoff available: ${context.type} - ${context.desktopContext.title || context.desktopContext.summary}`,
      tags: [
        'mobile-query',
        'handoff-summary',
        context.type
      ],
      metadata: {
        handoffId: context.id,
        queryable: true
      }
    };

    await this.memoryClient.store(summaryEntry);
  }

  /**
   * Generate mobile-appropriate actions for different event types
   */
  generateMobileActions(eventType, data) {
    const baseActions = {
      acknowledge: 'Mark as seen',
      getDetails: 'Get full context',
      postpone: 'Handle later'
    };

    const typeSpecificActions = {
      'meeting-cancelled': {
        rescheduleTasks: 'Reschedule blocked tasks',
        extendCurrentWork: 'Extend current work session',
        takeBreak: 'Take a well-deserved break',
        moveUpPriorities: 'Bring forward other priorities'
      },
      
      'end-of-day': {
        reviewTomorrow: 'Review tomorrow\'s agenda',
        addReminder: 'Add evening reminder',
        planMorning: 'Plan morning routine',
        checkCalendar: 'Check tomorrow\'s calendar'
      },
      
      'urgent-email': {
        draftResponse: 'Draft quick response',
        scheduleFollowup: 'Schedule follow-up',
        escalateTeam: 'Escalate to team',
        markPriority: 'Mark as high priority'
      },
      
      'workflow-complete': {
        reviewResults: 'Review workflow results',
        startNext: 'Start next workflow',
        shareUpdate: 'Share status update',
        scheduleReview: 'Schedule team review'
      },
      
      'calendar-conflict': {
        resolveConflict: 'Resolve scheduling conflict',
        moveToAvailable: 'Find alternative time',
        notifyAttendees: 'Notify attendees',
        prioritizeMeeting: 'Choose priority meeting'
      }
    };

    return {
      ...baseActions,
      ...(typeSpecificActions[eventType] || {})
    };
  }

  /**
   * Build context optimized for mobile queries
   */
  buildQueryContext(eventType, data) {
    return {
      // What happened
      event: {
        type: eventType,
        summary: data.summary || data.title,
        impact: data.impact || 'Medium',
        timeframe: data.timeframe || 'Immediate'
      },
      
      // Current state
      currentContext: {
        activeProjects: data.activeProjects || [],
        currentPriorities: data.currentPriorities || [],
        availableTime: data.availableTime || null,
        nextMeeting: data.nextMeeting || null
      },
      
      // Suggested queries for mobile Claude
      suggestedQueries: this.generateSuggestedQueries(eventType, data),
      
      // Quick reference data
      quickRef: {
        keyDates: data.keyDates || {},
        importantContacts: data.importantContacts || [],
        relatedDocuments: data.relatedDocuments || []
      }
    };
  }

  /**
   * Generate suggested queries mobile Claude can use
   */
  generateSuggestedQueries(eventType, data) {
    const baseQueries = [
      'What\'s my current context?',
      'What should I prioritize now?',
      'What actions can I take from mobile?'
    ];

    const typeSpecificQueries = {
      'meeting-cancelled': [
        'How should I use the freed 30 minutes?',
        'What tasks can I move earlier?',
        'Should I take a break or work on something else?'
      ],
      
      'end-of-day': [
        'What should I prepare for tomorrow?',
        'What were my key achievements today?',
        'Are there any urgent items for morning?'
      ],
      
      'urgent-email': [
        'How urgent is this email really?',
        'Can this wait until I\'m back at desktop?',
        'Who should I involve in the response?'
      ]
    };

    return [
      ...baseQueries,
      ...(typeSpecificQueries[eventType] || [])
    ];
  }

  /**
   * Generate summary text for notifications
   */
  generateSummary(eventType, data) {
    switch(eventType) {
      case 'meeting-cancelled':
        return `${data.meeting?.duration || '30min'} freed up at ${data.meeting?.time}`;
      case 'end-of-day':
        return `${data.achievements?.length || 0} tasks completed today`;
      case 'urgent-email':
        return `From ${data.email?.sender} - requires attention`;
      case 'workflow-complete':
        return `${data.workflow} finished with ${Object.keys(data.results || {}).length} outputs`;
      default:
        return data.summary || 'Update available';
    }
  }

  /**
   * Determine priority based on event type
   */
  determinePriority(eventType) {
    const priorityMap = {
      'urgent-email': 'max',
      'calendar-conflict': 'high',
      'meeting-cancelled': 'high',
      'workflow-complete': 'default',
      'end-of-day': 'default'
    };
    
    return priorityMap[eventType] || 'default';
  }

  /**
   * Generate ntfy action buttons
   */
  generateNtfyActions(eventType) {
    // Simple actions for now - can be enhanced when mobile MCP is available
    return [
      {
        action: 'view',
        label: 'Open Claude',
        url: 'claude://chat/new'
      }
    ];
  }

  /**
   * Retrieve handoff context (for testing or manual queries)
   */
  async getHandoffContext(handoffId) {
    if (!this.memoryClient) {
      throw new Error('No memory client configured');
    }

    const results = await this.memoryClient.search(`handoff-${handoffId}`);
    return results.find(r => r.metadata?.handoffId === handoffId);
  }

  /**
   * Clean up expired handoffs
   */
  async cleanupExpiredHandoffs() {
    if (!this.memoryClient) return;

    const now = new Date();
    const allHandoffs = await this.memoryClient.search('mobile-handoff');
    
    for (const handoff of allHandoffs) {
      try {
        const context = JSON.parse(handoff.content);
        if (new Date(context.expiresAt) < now) {
          await this.memoryClient.delete(handoff.id);
          console.log(`🧹 Cleaned up expired handoff: ${context.id}`);
        }
      } catch (error) {
        console.warn('Failed to parse handoff for cleanup:', error);
      }
    }
  }
}
