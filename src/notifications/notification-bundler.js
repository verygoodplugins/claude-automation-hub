/**
 * Smart Notification Bundler
 * Reduces notification overload by bundling updates and adding actionable buttons
 */

export class NotificationBundler {
  constructor(notificationManager, options = {}) {
    this.notificationManager = notificationManager;
    this.bundleWindow = options.bundleWindow || 30 * 60 * 1000; // 30 minutes
    this.maxBundleSize = options.maxBundleSize || 5;
    this.minBundleDelay = options.minBundleDelay || 2 * 60 * 1000; // 2 minutes
    
    // Current bundle
    this.currentBundle = {
      notifications: [],
      contexts: [],
      startTime: null,
      highestPriority: 'default'
    };
    
    // Bundle timer
    this.bundleTimer = null;
    
    console.log('🔗 Notification Bundler initialized - reducing notification overload');
  }

  /**
   * Add notification to current bundle instead of sending immediately
   */
  async addToBundle(type, context, actions = []) {
    const notification = {
      type,
      context,
      actions,
      timestamp: new Date().toISOString(),
      priority: context.priority || 'default'
    };

    // Initialize bundle if empty
    if (this.currentBundle.notifications.length === 0) {
      this.currentBundle.startTime = Date.now();
    }

    // Add to bundle
    this.currentBundle.notifications.push(notification);
    this.currentBundle.contexts.push(context);
    this.updateBundlePriority(notification.priority);

    console.log(`📦 Added to bundle: ${type} (${this.currentBundle.notifications.length}/${this.maxBundleSize})`);

    // Store individual context for mobile MCP retrieval
    await this.storeIndividualContext(type, context);

    // Check if we should send bundle now
    await this.checkBundleThresholds();
  }

  /**
   * Update bundle priority to highest priority notification
   */
  updateBundlePriority(newPriority) {
    const priorityLevels = { 'min': 1, 'low': 2, 'default': 3, 'high': 4, 'max': 5 };
    const currentLevel = priorityLevels[this.currentBundle.highestPriority] || 3;
    const newLevel = priorityLevels[newPriority] || 3;
    
    if (newLevel > currentLevel) {
      this.currentBundle.highestPriority = newPriority;
    }
  }

  /**
   * Check if bundle should be sent based on thresholds
   */
  async checkBundleThresholds() {
    const shouldSend = 
      this.currentBundle.notifications.length >= this.maxBundleSize || // Bundle full
      this.currentBundle.highestPriority === 'max' || // Urgent notification
      (this.currentBundle.startTime && Date.now() - this.currentBundle.startTime >= this.bundleWindow); // Time limit

    if (shouldSend) {
      await this.sendBundle();
    } else {
      // Set/reset timer for bundle window
      this.resetBundleTimer();
    }
  }

  /**
   * Reset the bundle timer
   */
  resetBundleTimer() {
    if (this.bundleTimer) {
      clearTimeout(this.bundleTimer);
    }

    const remainingTime = this.bundleWindow - (Date.now() - this.currentBundle.startTime);
    const delay = Math.max(remainingTime, this.minBundleDelay);

    this.bundleTimer = setTimeout(async () => {
      if (this.currentBundle.notifications.length > 0) {
        await this.sendBundle();
      }
    }, delay);
  }

  /**
   * Send the current bundle as a single notification with smart actions
   */
  async sendBundle() {
    if (this.currentBundle.notifications.length === 0) return;

    const bundle = this.currentBundle;
    
    // Generate bundle summary
    const summary = this.generateBundleSummary(bundle);
    
    // Generate smart action buttons
    const actions = this.generateSmartActions(bundle);
    
    // Create bundled notification
    const bundledNotification = {
      title: `🎯 ${bundle.notifications.length} Updates from Claude Hub`,
      summary: summary.short,
      message: summary.detailed,
      priority: bundle.highestPriority,
      tags: ['bundle', 'claude-hub', ...this.extractUniqueTags(bundle)],
      actions: actions
    };

    // Send the bundled notification
    console.log(`📤 Sending bundle: ${bundle.notifications.length} notifications`);
    console.log(`🎯 Generated ${actions.length} smart actions:`, actions.map(a => a.label));
    await this.notificationManager.sendNtfy(bundledNotification);

    // Store bundle context for mobile MCP
    await this.storeBundleContext(bundle, summary, actions);

    // Clear current bundle
    this.clearBundle();
  }

  /**
   * Generate smart summary for bundled notifications
   */
  generateBundleSummary(bundle) {
    const types = [...new Set(bundle.notifications.map(n => n.type))];
    const achievements = bundle.contexts.filter(c => c.achievements).flatMap(c => c.achievements);
    const timeSaved = bundle.contexts.reduce((total, c) => total + (c.timeSaved || 0), 0);
    
    // Short summary for notification
    const short = types.length === 1 
      ? `${types[0].replace(/-/g, ' ')} and ${bundle.notifications.length - 1} more updates`
      : `${types.slice(0, 2).join(' • ')}${types.length > 2 ? ` • +${types.length - 2} more` : ''}`;

    // Detailed summary for notification body
    const highlights = [];
    
    if (achievements.length > 0) {
      highlights.push(`✅ ${achievements.length} tasks completed`);
    }
    
    if (timeSaved > 0) {
      highlights.push(`⏱️ ${timeSaved} minutes saved`);
    }
    
    // Add key events
    const keyEvents = bundle.notifications
      .filter(n => ['meeting-cancelled', 'urgent-email', 'workflow-complete'].includes(n.type))
      .slice(0, 3)
      .map(n => this.summarizeNotification(n));
    
    highlights.push(...keyEvents);

    const detailed = highlights.length > 0 
      ? highlights.join('\n• ')
      : 'Multiple automation updates completed';

    return { short, detailed };
  }

  /**
   * Summarize individual notification for bundle
   */
  summarizeNotification(notification) {
    switch(notification.type) {
      case 'meeting-cancelled':
        return `📅 ${notification.context.meeting?.duration || '30min'} freed up`;
      case 'end-of-day':
        return `🌅 Day wrapped up`;
      case 'urgent-email':
        return `📧 Priority email from ${notification.context.email?.sender || 'unknown'}`;
      case 'workflow-complete':
        return `⚡ ${notification.context.workflow || 'Workflow'} finished`;
      default:
        return `${notification.context.title || notification.type}`;
    }
  }

  /**
   * Generate smart action buttons based on bundle content
   */
  generateSmartActions(bundle) {
    const types = [...new Set(bundle.notifications.map(n => n.type))];
    const hasUrgent = bundle.notifications.some(n => n.priority === 'max' || n.priority === 'high');
    const hasMeetingChange = types.includes('meeting-cancelled');
    const hasWorkflowComplete = types.includes('workflow-complete') || types.includes('end-of-day');
    
    const actions = [];

    // Always include "Get Context" action for mobile MCP preparation
    const contextQuery = this.buildContextQuery(bundle);
    actions.push({
      action: "view",
      label: "Ask Claude",
      url: `https://claude.ai/chat/new?message=${encodeURIComponent(contextQuery)}`
    });

    // Smart actions based on bundle content
    if (hasMeetingChange) {
      actions.push({
        action: "view", 
        label: "Reschedule",
        url: `https://claude.ai/chat/new?message=${encodeURIComponent(
          "I have some freed time from cancelled meetings. Help me reschedule my priorities and make the most of this time."
        )}`
      });
    }

    if (hasWorkflowComplete && !hasUrgent) {
      actions.push({
        action: "view",
        label: "Next Task",
        url: `https://claude.ai/chat/new?message=${encodeURIComponent(
          "My automation workflows are complete. What should I focus on next based on my priorities?"
        )}`
      });
    }

    if (hasUrgent) {
      actions.push({
        action: "view",
        label: "Handle Urgent",
        url: `https://claude.ai/chat/new?message=${encodeURIComponent(
          "I have urgent items that need attention. Help me prioritize and handle them efficiently."
        )}`
      });
    }

    return actions.slice(0, 3); // Limit to 3 actions for mobile compatibility
  }

  /**
   * Build a context query for Claude based on bundle contents
   */
  buildContextQuery(bundle) {
    const summary = this.generateBundleSummary(bundle);
    const timeContext = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    return `Hi Claude! I just received a bundled update from my automation hub at ${timeContext}:

${summary.detailed}

Based on these updates and my current context, what should I focus on next? Please consider:
- Any time that was freed up
- Completed tasks and momentum
- Current priorities and energy levels
- Optimal next actions

Help me make the most of this moment!`;
  }

  /**
   * Store individual context for mobile MCP access
   */
  async storeIndividualContext(type, context) {
    if (this.notificationManager.contextStore) {
      const handoffId = `bundle-item-${type}-${Date.now()}`;
      
      const contextEntry = {
        id: handoffId,
        type: `bundled-${type}`,
        timestamp: new Date().toISOString(),
        bundled: true,
        originalContext: context,
        tags: ['bundled', type, 'individual-context']
      };

      await this.notificationManager.contextStore.store(contextEntry);
    }
  }

  /**
   * Store bundle context for mobile MCP
   */
  async storeBundleContext(bundle, summary, actions) {
    if (this.notificationManager.contextStore) {
      const bundleId = `bundle-${Date.now()}`;
      
      const bundleContext = {
        id: bundleId,
        type: 'notification-bundle',
        timestamp: new Date().toISOString(),
        bundleSize: bundle.notifications.length,
        timeWindow: Date.now() - bundle.startTime,
        summary: summary,
        actions: actions,
        containedTypes: [...new Set(bundle.notifications.map(n => n.type))],
        allContexts: bundle.contexts,
        mobileQuery: this.buildContextQuery(bundle),
        tags: ['bundle', 'mobile-ready', 'actionable']
      };

      await this.notificationManager.contextStore.store(bundleContext);
      console.log(`💾 Stored bundle context: ${bundleId}`);
    }
  }

  /**
   * Extract unique tags from bundle
   */
  extractUniqueTags(bundle) {
    const allTags = bundle.notifications
      .flatMap(n => n.context.tags || [])
      .filter(tag => tag && typeof tag === 'string');
    
    return [...new Set(allTags)].slice(0, 3); // Limit tags
  }

  /**
   * Clear current bundle
   */
  clearBundle() {
    this.currentBundle = {
      notifications: [],
      contexts: [],
      startTime: null,
      highestPriority: 'default'
    };
    
    if (this.bundleTimer) {
      clearTimeout(this.bundleTimer);
      this.bundleTimer = null;
    }
  }

  /**
   * Force send current bundle (for testing or manual triggers)
   */
  async flushBundle() {
    if (this.currentBundle.notifications.length > 0) {
      console.log('🚀 Force flushing bundle...');
      await this.sendBundle();
    }
  }

  /**
   * Get current bundle status
   */
  getBundleStatus() {
    return {
      size: this.currentBundle.notifications.length,
      startTime: this.currentBundle.startTime,
      priority: this.currentBundle.highestPriority,
      timeRemaining: this.currentBundle.startTime 
        ? Math.max(0, this.bundleWindow - (Date.now() - this.currentBundle.startTime))
        : 0
    };
  }
}
