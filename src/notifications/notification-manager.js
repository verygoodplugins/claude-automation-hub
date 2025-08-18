/**
 * Unified Notification Manager for Mobile MCP Foundations
 * Handles ntfy.sh notifications with rich context storage for mobile handoffs
 */

import fetch from 'node-fetch';

export class NotificationManager {
  constructor(options = {}) {
    this.ntfyTopic = options.ntfyTopic || process.env.NTFY_TOPIC;
    this.ntfyBaseUrl = options.ntfyBaseUrl || 'https://ntfy.sh';
    this.contextStore = options.contextStore;
    
    if (!this.ntfyTopic) {
      console.warn('NTFY_TOPIC not configured. Notifications will be logged only.');
    }
  }

  /**
   * Send a contextual notification that stores rich data for mobile retrieval
   * @param {string} type - Notification type (e.g., 'end-of-day', 'meeting-change', 'urgent-task')
   * @param {Object} context - Rich context data
   * @param {Array} actions - Optional ntfy actions
   */
  async sendContextualNotification(type, context, actions = []) {
    try {
      // Store rich context first (for mobile MCP retrieval)
      const handoffId = await this.storeContext(type, context);
      
      // Send basic ntfy notification
      await this.sendNtfy({
        title: context.title,
        message: context.summary || context.message,
        tags: [type, 'automation', 'claude-hub'],
        priority: context.priority || 'default',
        actions: actions,
        // Include handoff ID for future mobile queries
        handoffId: handoffId
      });

      return { success: true, handoffId };
    } catch (error) {
      console.error('Failed to send contextual notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send basic ntfy notification
   * @param {Object} payload - Notification payload
   */
  async sendNtfy(payload) {
    if (!this.ntfyTopic) {
      console.log('📱 [NTFY DISABLED] Would send:', payload);
      return;
    }

    try {
      // Format as clean string message for iOS compatibility
      const title = payload.title || 'Claude Automation Hub';
      const message = payload.message || payload.summary || 'Update available';
      const priority = payload.priority || 'default';
      
      // Clean title for HTTP header (remove emojis and special chars)
      const cleanTitle = title.replace(/[^\x20-\x7E]/g, '').trim() || 'Claude Hub';
      
      // Create readable notification text with full title (including emojis)
      const notificationText = title === message ? message : `${title}\n\n${message}`;

      const response = await fetch(`${this.ntfyBaseUrl}/${this.ntfyTopic}`, {
        method: 'POST',
        headers: {
          'Title': cleanTitle,
          'Priority': priority,
          'Tags': (payload.tags || []).join(',')
        },
        body: notificationText
      });

      if (!response.ok) {
        throw new Error(`ntfy request failed: ${response.status}`);
      }

      console.log('📱 Notification sent successfully');
      return response;
    } catch (error) {
      console.error('Failed to send ntfy notification:', error);
      throw error;
    }
  }

  /**
   * Store rich context for mobile retrieval
   * @param {string} type - Context type
   * @param {Object} context - Context data
   * @returns {string} handoffId for mobile queries
   */
  async storeContext(type, context) {
    const handoffId = `handoff-${type}-${Date.now()}`;
    
    const fullContext = {
      id: handoffId,
      type: type,
      timestamp: new Date().toISOString(),
      desktopContext: context,
      mobileActions: this.generateMobileActions(type, context),
      expiresAt: new Date(Date.now() + 24*60*60*1000).toISOString(), // 24h expiry
      metadata: {
        source: 'automation-hub',
        deviceInitiated: 'desktop',
        version: '1.0.0'
      }
    };

    // Store in context store (openmemory or other)
    if (this.contextStore) {
      await this.contextStore.store(fullContext);
    } else {
      console.warn('No context store configured. Context not persisted.');
      console.log('📝 Would store context:', JSON.stringify(fullContext, null, 2));
    }

    return handoffId;
  }

  /**
   * Generate mobile-appropriate actions based on context type
   * @param {string} type - Context type
   * @param {Object} context - Context data
   * @returns {Array} mobile action suggestions
   */
  generateMobileActions(type, context) {
    const baseActions = ['acknowledge', 'postpone', 'get-details'];
    
    switch(type) {
      case 'meeting-cancelled':
        return [
          ...baseActions,
          'reschedule-tasks',
          'extend-current-work',
          'take-break',
          'move-up-priorities'
        ];
        
      case 'end-of-day':
        return [
          ...baseActions,
          'review-tomorrow',
          'add-reminder',
          'plan-morning',
          'check-calendar'
        ];
        
      case 'urgent-email':
        return [
          ...baseActions,
          'draft-response',
          'schedule-follow-up',
          'escalate-to-team',
          'mark-priority'
        ];
        
      case 'workflow-complete':
        return [
          ...baseActions,
          'review-results',
          'start-next-task',
          'share-update',
          'schedule-review'
        ];
        
      default:
        return baseActions;
    }
  }

  /**
   * Quick notification methods for common scenarios
   */
  async notifyEndOfDay(summary, achievements = [], tomorrowFocus = '') {
    return this.sendContextualNotification('end-of-day', {
      title: '🌅 End of Day Report Ready',
      summary: `${achievements.length} achievements completed`,
      message: summary,
      achievements,
      tomorrowFocus,
      priority: 'default'
    });
  }

  async notifyMeetingChange(meetingDetails, changeType = 'cancelled') {
    return this.sendContextualNotification('meeting-change', {
      title: `📅 Meeting ${changeType}: ${meetingDetails.title}`,
      summary: `${meetingDetails.duration || '30min'} freed up at ${meetingDetails.time}`,
      meeting: meetingDetails,
      changeType,
      priority: 'high'
    });
  }

  async notifyUrgentTask(taskDetails) {
    return this.sendContextualNotification('urgent-task', {
      title: '🚨 Urgent Task Detected',
      summary: taskDetails.summary,
      task: taskDetails,
      priority: 'max'
    });
  }

  async notifyWorkflowComplete(workflowName, results = {}) {
    return this.sendContextualNotification('workflow-complete', {
      title: `✅ ${workflowName} Complete`,
      summary: `Workflow finished with ${Object.keys(results).length} outputs`,
      workflow: workflowName,
      results,
      priority: 'default'
    });
  }
}
