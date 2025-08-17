// Helper tool for quick workflow notifications
export default {
  name: "workflow_notification",
  description: "Quick notification helper for workflow start/progress/completion alerts",
  inputSchema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["start", "progress", "complete", "error"],
        description: "Type of workflow notification"
      },
      workflow: {
        type: "string",
        description: "Name of the workflow (e.g., 'Morning Routine', 'End of Day')"
      },
      details: {
        type: "string",
        description: "Optional details about progress or completion",
        default: ""
      }
    },
    required: ["type", "workflow"]
  },
  handler: async ({ type, workflow, details = "" }) => {
    // Import the main notification tool
    const ntfyTool = await import('./ntfy-notifications.js');
    
    let message, title, priority, tags;
    
    switch (type) {
      case "start":
        message = `🔄 Starting ${workflow}...${details ? '\n' + details : ''}`;
        title = "Workflow Started";
        priority = "low";
        tags = ["workflow", "start"];
        break;
        
      case "progress":
        message = `⏳ ${workflow} in progress...${details ? '\n' + details : ''}`;
        title = "Workflow Progress";
        priority = "min";
        tags = ["workflow", "progress"];
        break;
        
      case "complete":
        message = `✅ ${workflow} complete!${details ? '\n\n' + details : ''}`;
        title = "Workflow Complete";
        priority = "default";
        tags = ["workflow", "complete"];
        break;
        
      case "error":
        message = `⚠️ ${workflow} encountered an issue${details ? ':\n' + details : ''}`;
        title = "Workflow Error";
        priority = "high";
        tags = ["workflow", "error"];
        break;
        
      default:
        return { success: false, error: "Invalid notification type" };
    }
    
    // Send the notification using the main tool
    const result = await ntfyTool.default.handler({
      message,
      title,
      priority,
      tags
    });
    
    return {
      ...result,
      notificationType: type,
      workflow: workflow
    };
  }
};
