# Automated Workflow Scheduling

## 🎯 **Problem Solved**
Instead of manually triggering workflows, your automation hub now **automatically runs** your morning routine at 7 AM, end-of-day at 5:30 PM, and monitors for urgent items throughout the day.

## ⏰ **Automatic Schedules**

### **Daily Workflows:**
- 🌅 **Morning Routine**: 7:00 AM Monday-Friday
- 🌇 **End-of-Day Shutdown**: 5:30 PM Monday-Friday  
- 🔍 **Urgent Monitoring**: Every 15 minutes during work hours

### **Weekly Workflows:**
- 📊 **Weekly Review**: Friday 4:00 PM

## 🚀 **Quick Start**

```bash
# Test the scheduler system
npm run test-scheduler

# This will:
# 1. Start the automated scheduler
# 2. Show you all active schedules  
# 3. Demo custom scheduling
# 4. Run workflows automatically
```

## 💻 **Production Usage**

### **1. Start Automated Scheduling**
```javascript
import AutomationHub from './src/automation-hub.js';

const hub = new AutomationHub({
  ntfyTopic: 'your-topic-name',
  timezone: 'Europe/Berlin'
});

// Start automated scheduling
hub.startScheduler();

// Your workflows now run automatically!
```

### **2. What Happens Automatically**

**Every Monday-Friday at 7:00 AM:**
```
🌅 Morning Routine triggers automatically
✅ Calendar reviewed
✅ Urgent emails triaged  
✅ Daily priorities set
📱 Bundled notification: "Morning routine complete + next actions"
```

**Every Monday-Friday at 5:30 PM:**
```
🌇 End-of-Day triggers automatically  
✅ Work saved to memory
✅ Tomorrow's priorities set
✅ Browser cleaned up
📱 Bundled notification: "Day complete + tomorrow ready"
```

**Every 15 minutes during work hours:**
```
🔍 Urgent monitoring checks for:
📧 High-priority emails
📅 Meeting changes  
💬 Urgent Slack messages
🚨 System alerts
```

## 🛠 **Customization**

### **Add Your Own Schedules**
```javascript
// Custom morning standup notification
hub.addSchedule('standup-reminder', '08:45', [1,2,3,4,5], async () => {
  await hub.notifyUrgentTask({
    summary: 'Daily standup in 15 minutes',
    priority: 'high'
  });
});

// Friday afternoon break reminder  
hub.addSchedule('friday-break', '15:00', [5], async () => {
  await hub.notificationBundler.addToBundle('break-reminder', {
    title: '☕ Friday Afternoon Break',
    summary: 'Time for a well-deserved break!',
    priority: 'default'
  });
});
```

### **One-Time Scheduled Tasks**
```javascript
// Schedule a reminder for specific time
hub.scheduler.scheduleOnce('project-deadline', '2025-08-25 09:00', async () => {
  await hub.notifyUrgentTask({
    summary: 'Project deadline is today!',
    priority: 'max'
  });
});
```

## 🔗 **Real-World Integration**

### **With MCP Data Sources**
```javascript
// Enhanced urgent monitoring with real data
async checkForUrgentItems() {
  // Check Gmail via MCP
  const urgentEmails = await gmail.search('is:unread is:important');
  
  // Check Calendar via MCP  
  const cancelledMeetings = await calendar.getRecentChanges();
  
  // Check Slack via MCP
  const mentions = await slack.getMentions();
  
  // Generate contextual notifications
  if (urgentEmails.length > 0) {
    await this.hub.notifyUrgentTask({
      summary: `${urgentEmails.length} urgent emails need attention`,
      emails: urgentEmails
    });
  }
}
```

### **Context-Aware Scheduling**
```javascript
// Smart scheduling based on patterns
async runMorningRoutine() {
  const now = new Date();
  
  // Adjust based on context
  if (now.getDay() === 1) { // Monday
    await this.addWeeklyGoalSetting();
  }
  
  if (await this.detectVacationMode()) {
    await this.sendLightMorningRoutine();
  } else {
    await this.sendFullMorningRoutine();
  }
}
```

## 📱 **Mobile Integration**

All scheduled workflows use your smart bundling system:

- **Fewer notifications**: Multiple morning tasks → 1 bundle
- **Action buttons**: "Plan Day", "Check Calendar", "Next Task"  
- **Mobile MCP ready**: When mobile MCP launches, full context handoff

## 🎛 **Control Commands**

```javascript
// Scheduler management
hub.startScheduler();          // Start all automation
hub.stopScheduler();           // Stop all scheduling
hub.getSchedulerStatus();      // Check what's running
hub.listSchedules();           // See all active schedules

// Custom scheduling
hub.addSchedule(name, time, days, function);
hub.removeSchedule(name);

// Manual triggers (for testing)
await hub.scheduler.runMorningRoutine();
await hub.scheduler.runEndOfDay();
await hub.scheduler.runWeeklyReview();
```

## 🔮 **Future Enhancements**

### **Location-Based Triggers**
```javascript
// When mobile MCP + location data available
"When I arrive at office → trigger morning routine"
"When I leave office → trigger end-of-day"
"When I'm traveling → adjust schedule timezone"
```

### **AI-Powered Scheduling**
```javascript
// Claude learns your patterns
"User typically works late on Fridays → delay end-of-day"
"Heavy meeting day detected → suggest focus time blocks"
"Vacation mode → lighter automation schedule"
```

### **Event-Driven Intelligence**
```javascript
// React to real-world changes
"Meeting cancelled → immediately suggest task reschedule"
"Urgent email from CEO → override bundling, notify immediately"
"System outage detected → pause non-critical automations"
```

## ⚡ **Benefits**

✅ **Zero-effort automation** - Your workflows run themselves  
✅ **Consistent habits** - Never forget morning/evening routines  
✅ **Proactive monitoring** - Catch urgent items before they escalate  
✅ **Context-aware timing** - Smart scheduling based on your patterns  
✅ **Mobile-first design** - Works perfectly with notification bundling  

**Your automation hub is now a true AI assistant that works 24/7!** 🤖⏰

---

**Start with:** `npm run test-scheduler` to see it in action! 🚀
