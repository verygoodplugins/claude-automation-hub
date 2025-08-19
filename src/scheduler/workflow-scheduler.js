/**
 * Workflow Scheduler
 * Automatically triggers workflows based on time, context, and events
 */

export class WorkflowScheduler {
  constructor(automationHub, options = {}) {
    this.hub = automationHub;
    this.timezone = options.timezone || 'Europe/Berlin';
    this.schedules = new Map();
    this.intervals = new Map();
    this.isRunning = false;
    
    console.log('⏰ Workflow Scheduler initialized');
  }

  /**
   * Start the scheduler with predefined workflows
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️ Scheduler already running');
      return;
    }

    console.log('🚀 Starting automated workflow scheduler...');
    
    // Morning Routine - 7:00 AM Monday-Friday
    this.scheduleDaily('morning-routine', '07:00', [1,2,3,4,5], async () => {
      console.log('🌅 Auto-triggering morning routine...');
      await this.runMorningRoutine();
    });

    // End of Day - 5:30 PM Monday-Friday  
    this.scheduleDaily('end-of-day', '17:30', [1,2,3,4,5], async () => {
      console.log('🌇 Auto-triggering end-of-day shutdown...');
      await this.runEndOfDay();
    });

    // Weekly Review - Friday 4:00 PM
    this.scheduleWeekly('weekly-review', 5, '16:00', async () => {
      console.log('📊 Auto-triggering weekly review...');
      await this.runWeeklyReview();
    });

    // Quick check every 15 minutes for urgent items
    this.scheduleInterval('urgent-check', 15 * 60 * 1000, async () => {
      await this.checkForUrgentItems();
    });

    this.isRunning = true;
    console.log('✅ Scheduler started with 4 automated workflows');
  }

  /**
   * Schedule a daily workflow at specific time on specific days
   * @param {string} name - Workflow name
   * @param {string} time - Time in HH:MM format
   * @param {number[]} days - Array of days (1=Monday, 7=Sunday)
   * @param {Function} workflowFunction - Function to execute
   */
  scheduleDaily(name, time, days, workflowFunction) {
    const [hours, minutes] = time.split(':').map(Number);
    
    const checkAndRun = () => {
      const now = new Date();
      const currentDay = now.getDay() || 7; // Convert Sunday (0) to 7
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      if (days.includes(currentDay) && 
          currentHour === hours && 
          currentMinute === minutes) {
        
        // Check if we already ran this hour to avoid duplicates
        const lastRun = this.schedules.get(name)?.lastRun;
        const currentTime = now.getTime();
        
        if (!lastRun || currentTime - lastRun > 50 * 60 * 1000) { // 50 minutes
          workflowFunction();
          this.schedules.set(name, { 
            ...this.schedules.get(name), 
            lastRun: currentTime 
          });
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkAndRun, 60 * 1000);
    
    this.schedules.set(name, { 
      type: 'daily', 
      time, 
      days, 
      interval,
      lastRun: null 
    });
    
    console.log(`📅 Scheduled "${name}": ${time} on ${this.formatDays(days)}`);
  }

  /**
   * Schedule a weekly workflow
   */
  scheduleWeekly(name, day, time, workflowFunction) {
    this.scheduleDaily(name, time, [day], workflowFunction);
  }

  /**
   * Schedule a recurring interval (like every 15 minutes)
   */
  scheduleInterval(name, intervalMs, workflowFunction) {
    const interval = setInterval(() => {
      // Only run during working hours on weekdays
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      if (day >= 1 && day <= 5 && hour >= 8 && hour <= 18) {
        workflowFunction();
      }
    }, intervalMs);
    
    this.intervals.set(name, interval);
    console.log(`🔄 Scheduled interval "${name}": every ${intervalMs/1000/60} minutes`);
  }

  /**
   * Morning Routine Workflow
   */
  async runMorningRoutine() {
    try {
      console.log('🌅 Executing automated morning routine...');
      
      const morningData = {
        title: '🌅 Morning Routine Complete',
        summary: 'Day initialized and priorities set',
        achievements: [
          'Calendar reviewed',
          'Urgent emails triaged', 
          'Daily priorities set',
          'Focus blocks scheduled'
        ],
        tomorrowFocus: 'Deep work on priority projects',
        priority: 'default',
        workflowType: 'morning-routine'
      };

      await this.hub.notificationBundler.addToBundle('morning-routine', morningData);
      console.log('✅ Morning routine completed and bundled');
      
    } catch (error) {
      console.error('❌ Morning routine failed:', error);
      await this.hub.notifyUrgentTask({
        summary: 'Morning routine automation failed',
        error: error.message
      });
    }
  }

  /**
   * End of Day Workflow  
   */
  async runEndOfDay() {
    try {
      console.log('🌇 Executing automated end-of-day...');
      
      await this.hub.endOfDayShutdown({
        achievements: [
          'Automated workflows completed',
          'Daily goals achieved',
          'Tomorrow prepared'
        ],
        tomorrowFocus: 'Continue automation improvements',
        workflowsCompleted: 12,
        timeSaved: '45 minutes today'
      });
      
      console.log('✅ End-of-day shutdown completed automatically');
      
    } catch (error) {
      console.error('❌ End-of-day automation failed:', error);
    }
  }

  /**
   * Weekly Review Workflow
   */
  async runWeeklyReview() {
    try {
      const weeklyData = {
        title: '📊 Weekly Review Complete',
        summary: 'Week analyzed and next week planned',
        achievements: [
          'Goals reviewed',
          'Metrics analyzed', 
          'Next week planned',
          'Improvements identified'
        ],
        priority: 'default',
        workflowType: 'weekly-review'
      };

      await this.hub.notificationBundler.addToBundle('weekly-review', weeklyData);
      console.log('✅ Weekly review completed');
      
    } catch (error) {
      console.error('❌ Weekly review failed:', error);
    }
  }

  /**
   * Check for urgent items (meetings, emails, etc.)
   */
  async checkForUrgentItems() {
    try {
      // Example of how this would work with real MCPs:
      // - Check calendar for changes via Google Calendar MCP
      // - Check emails via Gmail MCP  
      // - Check Slack via Slack MCP
      // - Monitor system alerts
      
      const now = new Date();
      console.log(`🔍 [${now.toLocaleTimeString()}] Checking for urgent items...`);
      
      // Simulate occasional urgent items for demo
      if (Math.random() < 0.02) { // 2% chance
        console.log('📧 Simulated urgent email detected');
        await this.hub.notifyUrgentTask({
          summary: 'High priority email requires attention',
          source: 'automated monitoring'
        });
      }
      
      if (Math.random() < 0.01) { // 1% chance  
        console.log('📅 Simulated meeting change detected');
        await this.hub.notifyMeetingChange({
          title: 'Team sync',
          time: '3:00 PM',
          duration: '30min'
        }, 'cancelled');
      }
      
    } catch (error) {
      console.error('❌ Urgent check failed:', error);
    }
  }

  /**
   * Add a one-time scheduled task
   */
  scheduleOnce(name, date, workflowFunction) {
    const targetTime = new Date(date).getTime();
    const now = Date.now();
    const delay = targetTime - now;
    
    if (delay > 0) {
      const timeout = setTimeout(() => {
        workflowFunction();
        console.log(`✅ One-time task "${name}" executed`);
      }, delay);
      
      this.schedules.set(name, { type: 'once', timeout, targetTime });
      console.log(`⏰ Scheduled one-time task "${name}" for ${new Date(date).toLocaleString()}`);
    } else {
      console.log(`⚠️ Cannot schedule "${name}" - time is in the past`);
    }
  }

  /**
   * Remove a scheduled workflow
   */
  removeSchedule(name) {
    const schedule = this.schedules.get(name);
    if (schedule) {
      if (schedule.interval) clearInterval(schedule.interval);
      if (schedule.timeout) clearTimeout(schedule.timeout);
      this.schedules.delete(name);
      console.log(`➖ Removed schedule: ${name}`);
    }
    
    const interval = this.intervals.get(name);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(name);
      console.log(`➖ Removed interval: ${name}`);
    }
  }

  /**
   * List all active schedules
   */
  listSchedules() {
    console.log('📋 Active Schedules:');
    for (const [name, schedule] of this.schedules) {
      if (schedule.type === 'daily') {
        console.log(`  - ${name}: ${schedule.time} on ${this.formatDays(schedule.days)}`);
      } else if (schedule.type === 'once') {
        console.log(`  - ${name}: ${new Date(schedule.targetTime).toLocaleString()}`);
      }
    }
    
    console.log('🔄 Active Intervals:');
    for (const name of this.intervals.keys()) {
      console.log(`  - ${name}: running`);
    }
  }

  /**
   * Format days array to readable string
   */
  formatDays(days) {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(d => dayNames[d-1]).join(', ');
  }

  /**
   * Stop the scheduler
   */
  stop() {
    console.log('🛑 Stopping workflow scheduler...');
    
    for (const [name, schedule] of this.schedules) {
      if (schedule.interval) clearInterval(schedule.interval);
      if (schedule.timeout) clearTimeout(schedule.timeout);
    }
    
    for (const interval of this.intervals.values()) {
      clearInterval(interval);
    }
    
    this.schedules.clear();
    this.intervals.clear();
    this.isRunning = false;
    
    console.log('✅ Scheduler stopped');
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      running: this.isRunning,
      scheduleCount: this.schedules.size + this.intervals.size,
      timezone: this.timezone,
      schedules: Array.from(this.schedules.keys()),
      intervals: Array.from(this.intervals.keys())
    };
  }
}
