/**
 * Claude Automation Hub - Mobile-Ready Main Integration
 * Connects NotificationManager + ContextBridge + openmemory for federated AI workflows
 */

import { NotificationManager } from './notifications/notification-manager.js';
import { ContextBridge } from './context/context-bridge.js';
import { NotificationBundler } from './notifications/notification-bundler.js';
import { WorkflowScheduler } from './scheduler/workflow-scheduler.js';

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
    
    // Initialize smart notification bundler
    this.notificationBundler = new NotificationBundler(this.notificationManager, {
      bundleWindow: options.bundleWindow || 30 * 60 * 1000, // 30 minutes
      maxBundleSize: options.maxBundleSize || 4,
      minBundleDelay: options.minBundleDelay || 2 * 60 * 1000 // 2 minutes
    });
    
    // Initialize workflow scheduler
    this.scheduler = new WorkflowScheduler(this, {
      timezone: options.timezone || 'Europe/Berlin'
    });
    
    console.log('🚀 Claude Automation Hub initialized with mobile-ready architecture + smart bundling + auto-scheduling');
  }

  /**
   * End of day workflow with bundled notifications
   */
  async endOfDayShutdown(data = {}) {
    console.log('🌅 Starting end-of-day shutdown with smart bundling...');
    
    const endOfDayData = {
      title: '🌅 End of Day Report Ready',
      summary: `${data.achievements?.length || 0} achievements completed`,
      achievements: data.achievements || [],
      tomorrowFocus: data.tomorrowFocus || '',
      workflowsCompleted: data.workflowsCompleted || 12,
      timeSaved: data.timeSaved || '63+ hours monthly',
      nextPriorities: data.nextPriorities || [],
      relatedWorkflows: ['end-of-day', 'morning-prep'],
      priority: 'default',
      ...data
    };

    // Add to bundle instead of sending immediately
    await this.notificationBundler.addToBundle('end-of-day', endOfDayData);
    
    console.log('📦 End-of-day added to notification bundle');
    console.log('📱 Will be included in next bundled notification');
    
    return { success: true, bundled: true, type: 'end-of-day' };
  }

  /**
   * Meeting change notification with bundled context
   */
  async notifyMeetingChange(meetingDetails, changeType = 'cancelled') {
    console.log(`📅 Processing meeting ${changeType}: ${meetingDetails.title}`);
    
    const meetingData = {
      title: `📅 Meeting ${changeType}: ${meetingDetails.title}`,
      summary: `${meetingDetails.duration || '30min'} freed up at ${meetingDetails.time}`,
      meeting: meetingDetails,
      changeType,
      impact: 'High', // Freed time is valuable
      timeframe: 'Immediate',
      availableTime: meetingDetails.duration,
      currentPriorities: meetingDetails.currentPriorities || [],
      relatedWorkflows: ['calendar-management', 'task-scheduling'],
      priority: 'high' // Meeting changes are high priority
    };

    // Add to bundle
    await this.notificationBundler.addToBundle('meeting-cancelled', meetingData);
    
    console.log('📦 Meeting change added to notification bundle');
    return { success: true, bundled: true, type: 'meeting-cancelled' };
  }

  /**
   * Quick notification methods (now bundled)
   */
  async notifyWorkflowComplete(workflowName, results = {}) {
    const workflowData = {
      title: `✅ ${workflowName} Complete`,
      summary: `Workflow finished with ${Object.keys(results).length} outputs`,
      workflow: workflowName,
      results,
      priority: 'default'
    };
    
    await this.notificationBundler.addToBundle('workflow-complete', workflowData);
    return { success: true, bundled: true, type: 'workflow-complete' };
  }

  async notifyUrgentTask(taskDetails) {
    const urgentData = {
      title: '🚨 Urgent Task Detected',
      summary: taskDetails.summary,
      task: taskDetails,
      priority: 'max' // Urgent tasks trigger immediate bundle send
    };
    
    await this.notificationBundler.addToBundle('urgent-task', urgentData);
    return { success: true, bundled: true, type: 'urgent-task' };
  }

  /**
   * Test the bundled notification system with multiple events
   */
  async testBundledNotifications() {
    console.log('🧪 Testing bundled notification system...');
    
    // Simulate multiple automation events happening close together
    console.log('1. Simulating end-of-day workflow...');
    await this.endOfDayShutdown({
      achievements: ['Built notification bundler', 'Reduced notification overload', 'Added smart actions'],
      tomorrowFocus: 'Test mobile MCP integration'
    });
    
    // Wait a moment
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('2. Simulating meeting cancellation...');
    await this.notifyMeetingChange({
      title: 'Team standup',
      time: '10:00 AM',
      duration: '30min',
      currentPriorities: ['Test bundled notifications', 'Prepare mobile MCP integration']
    }, 'cancelled');
    
    // Wait a moment
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('3. Simulating workflow completion...');
    await this.notifyWorkflowComplete('Morning Email Triage', {
      emailsProcessed: 12,
      urgentFlagged: 2,
      timeSaved: '15 minutes'
    });
    
    // Check bundle status
    const status = this.notificationBundler.getBundleStatus();
    console.log('📈 Bundle Status:', {
      notifications: status.size,
      priority: status.priority,
      timeRemaining: Math.round(status.timeRemaining / 1000) + 's'
    });
    
    console.log('🗺 Bundle will send automatically when:');
    console.log('  - 4 notifications accumulated, OR');
    console.log('  - Max priority notification added, OR');
    console.log('  - 30 minutes elapsed');
    console.log('');
    console.log('🚀 Try: hub.flushBundle() to send immediately');
    
    return { 
      success: true, 
      bundleStatus: status,
      message: 'Bundled notifications queued - will send automatically based on thresholds'
    };
  }

  /**
   * Manually flush the current bundle (for testing or immediate send)
   */
  async flushBundle() {
    console.log('🚀 Manually flushing notification bundle...');
    await this.notificationBundler.flushBundle();
    return { success: true, message: 'Bundle flushed and sent' };
  }

  /**
   * Get current bundle status
   */
  getBundleStatus() {
    return this.notificationBundler.getBundleStatus();
  }

  /**
   * Scheduler Control Methods
   */
  
  /**
   * Start automated workflow scheduling
   */
  startScheduler() {
    console.log('🚀 Starting automated workflow scheduler...');
    this.scheduler.start();
    return { success: true, message: 'Scheduler started' };
  }

  /**
   * Stop automated scheduling
   */
  stopScheduler() {
    console.log('🛱 Stopping scheduler...');
    this.scheduler.stop();
    return { success: true, message: 'Scheduler stopped' };
  }

  /**
   * Get scheduler status and list of active schedules
   */
  getSchedulerStatus() {
    return this.scheduler.getStatus();
  }

  /**
   * List all active scheduled workflows
   */
  listSchedules() {
    this.scheduler.listSchedules();
  }

  /**
   * Add a custom scheduled workflow
   */
  addSchedule(name, time, days, workflowFunction) {
    this.scheduler.scheduleDaily(name, time, days, workflowFunction);
    return { success: true, message: `Schedule "${name}" added` };
  }

  /**
   * Remove a scheduled workflow
   */
  removeSchedule(name) {
    this.scheduler.removeSchedule(name);
    return { success: true, message: `Schedule "${name}" removed` };
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
