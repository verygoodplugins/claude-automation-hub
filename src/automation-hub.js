/**
 * Claude Automation Hub - Mobile-Ready Main Integration
 * Connects NotificationManager + ContextBridge + openmemory for federated AI workflows
 */

import { NotificationManager } from './notifications/notification-manager.js';
import { ContextBridge } from './context/context-bridge.js';

export class AutomationHub {
  constructor(options = {}) {
    // Will be connected via MCP when available
    this.openmemoryClient = options.openmemoryClient || new MockOpenmemoryClient();
    
    // Initialize notification manager
    this.notificationManager = new NotificationManager({
      ntfyTopic: options.ntfyTopic,
      contextStore: this.openmemoryClient
    });
    
    // Initialize context bridge
    this.contextBridge = new ContextBridge({
      openmemoryClient: this.openmemoryClient,
      notificationManager: this.notificationManager
    });
    
    console.log('🚀 Claude Automation Hub initialized with mobile-ready architecture');
  }

  /**
   * End of day workflow with mobile notifications
   */
  async endOfDayShutdown(data = {}) {
    console.log('🌅 Starting end-of-day shutdown with mobile handoff...');
    
    const endOfDayData = {
      title: 'End of Day Report Ready',
      summary: `${data.achievements?.length || 0} achievements completed`,
      achievements: data.achievements || [],
      tomorrowFocus: data.tomorrowFocus || '',
      workflowsCompleted: data.workflowsCompleted || 12,
      timeSaved: data.timeSaved || '63+ hours monthly',
      nextPriorities: data.nextPriorities || [],
      relatedWorkflows: ['end-of-day', 'morning-prep'],
      ...data
    };

    // Create mobile handoff
    const result = await this.contextBridge.createMobileHandoff('end-of-day', endOfDayData);
    
    if (result.success) {
      console.log(`✅ Mobile handoff created: ${result.handoffId}`);
      console.log('📱 Notification sent - you can now grab coffee while staying informed!');
    }
    
    return result;
  }

  /**
   * Meeting change notification with context
   */
  async notifyMeetingChange(meetingDetails, changeType = 'cancelled') {
    console.log(`📅 Processing meeting ${changeType}: ${meetingDetails.title}`);
    
    const meetingData = {
      title: `Meeting ${changeType}: ${meetingDetails.title}`,
      summary: `${meetingDetails.duration || '30min'} freed up at ${meetingDetails.time}`,
      meeting: meetingDetails,
      changeType,
      impact: 'High', // Freed time is valuable
      timeframe: 'Immediate',
      availableTime: meetingDetails.duration,
      currentPriorities: meetingDetails.currentPriorities || [],
      relatedWorkflows: ['calendar-management', 'task-scheduling']
    };

    return await this.contextBridge.createMobileHandoff('meeting-cancelled', meetingData);
  }

  /**
   * Quick notification methods
   */
  async notifyWorkflowComplete(workflowName, results = {}) {
    return await this.notificationManager.notifyWorkflowComplete(workflowName, results);
  }

  async notifyUrgentTask(taskDetails) {
    return await this.notificationManager.notifyUrgentTask(taskDetails);
  }

  /**
   * Test the mobile notification system
   */
  async testMobileNotifications() {
    console.log('🧪 Testing mobile notification system...');
    
    // Test basic notification
    const basicTest = await this.notificationManager.sendNtfy({
      title: '🧪 Test Notification',
      message: 'Claude Automation Hub mobile notifications are working!',
      tags: ['test', 'automation-hub'],
      priority: 'default'
    });

    // Test contextual handoff
    const handoffTest = await this.contextBridge.createMobileHandoff('test', {
      title: 'Mobile Handoff Test',
      summary: 'Testing cross-device AI context sharing',
      testData: {
        timestamp: new Date().toISOString(),
        features: ['notifications', 'context-storage', 'mobile-actions'],
        status: 'ready-for-mobile-mcp'
      }
    });

    console.log('📊 Test Results:');
    console.log('  Basic notification:', basicTest ? '✅' : '❌');
    console.log('  Context handoff:', handoffTest.success ? '✅' : '❌');
    console.log('  Handoff ID:', handoffTest.handoffId);
    
    return {
      basicNotification: !!basicTest,
      contextHandoff: handoffTest.success,
      handoffId: handoffTest.handoffId
    };
  }

  /**
   * Clean up expired contexts
   */
  async cleanup() {
    await this.contextBridge.cleanupExpiredHandoffs();
  }
}

/**
 * Mock openmemory client for testing without MCP
 */
class MockOpenmemoryClient {
  constructor() {
    this.storage = new Map();
    console.log('📝 Using mock openmemory client (will use real MCP when available)');
  }

  async store(entry) {
    const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.storage.set(id, { id, ...entry, timestamp: new Date().toISOString() });
    console.log(`💾 Stored in mock memory: ${entry.tags?.[0] || 'entry'}`);
    return id;
  }

  async search(query) {
    const results = Array.from(this.storage.values())
      .filter(entry => 
        JSON.stringify(entry).toLowerCase().includes(query.toLowerCase()) ||
        entry.tags?.some(tag => tag.includes(query))
      );
    console.log(`🔍 Mock search for "${query}": ${results.length} results`);
    return results;
  }

  async delete(id) {
    const deleted = this.storage.delete(id);
    console.log(`🗑️ Mock delete: ${deleted ? 'success' : 'not found'}`);
    return deleted;
  }
}

export default AutomationHub;
