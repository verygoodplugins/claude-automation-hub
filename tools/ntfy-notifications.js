// MCP tool for sending push notifications via ntfy.sh
import fetch from 'node-fetch';

export default {
  name: "send_notification",
  description: "Send push notifications to mobile devices via ntfy.sh for workflow completion alerts",
  inputSchema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "The notification message to send",
        maxLength: 4096
      },
      title: {
        type: "string", 
        description: "Optional notification title",
        default: "Claude Automation Hub"
      },
      priority: {
        type: "string",
        enum: ["min", "low", "default", "high", "urgent"],
        description: "Notification priority level",
        default: "default"
      },
      tags: {
        type: "array",
        items: { type: "string" },
        description: "Optional tags for categorization (e.g., ['workflow', 'complete'])",
        default: []
      },
      topic: {
        type: "string",
        description: "Override default ntfy topic if needed",
        default: ""
      },
      actions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["view", "http", "broadcast"],
              description: "Action type: view (open URL), http (send request), broadcast (Android intent)"
            },
            label: {
              type: "string",
              description: "Button label text",
              maxLength: 30
            },
            url: {
              type: "string",
              description: "URL to open (for view action) or endpoint (for http action)"
            },
            method: {
              type: "string",
              enum: ["GET", "POST", "PUT"],
              description: "HTTP method (for http action only)",
              default: "GET"
            }
          },
          required: ["action", "label"]
        },
        description: "Optional action buttons for the notification",
        default: []
      }
    },
    required: ["message"]
  },
  handler: async ({ message, title = "Claude Automation Hub", priority = "default", tags = [], topic = "", actions = [] }) => {
    try {
      // Use environment variable or default topic
      const ntfyTopic = topic || process.env.NTFY_TOPIC || "claude-automation-alerts-x7y9z";
      
      if (!ntfyTopic) {
        return {
          success: false,
          error: "NTFY_TOPIC environment variable not set and no topic provided",
          setup: "Generate a unique topic: echo 'NTFY_TOPIC=claude-automation-$(whoami)-$(openssl rand -hex 4)' >> .env"
        };
      }

      // Build ntfy URL
      const ntfyUrl = `https://ntfy.sh/${ntfyTopic}`;
      
      // Prepare headers for advanced features
      const headers = {
        'Content-Type': 'text/plain; charset=utf-8',
        'Title': title,
        'Priority': priority
      };

      // Add tags if provided
      if (tags.length > 0) {
        headers['Tags'] = tags.join(',');
      }

      // Add icons based on tags or default
      if (tags.includes('complete')) {
        headers['Tags'] = (headers['Tags'] || '') + ',white_check_mark';
      } else if (tags.includes('error')) {
        headers['Tags'] = (headers['Tags'] || '') + ',warning';
      } else {
        headers['Tags'] = (headers['Tags'] || '') + ',robot';
      }

      // Add action buttons if provided
      if (actions.length > 0) {
        const actionStrings = actions.map(action => {
          if (action.action === 'view') {
            return `view, ${action.label}, ${action.url || ''}`;
          } else if (action.action === 'http') {
            const method = action.method || 'GET';
            return `http, ${action.label}, ${action.url || ''}, method=${method}`;
          } else if (action.action === 'broadcast') {
            return `broadcast, ${action.label}, ${action.url || ''}`;
          }
          return `${action.action}, ${action.label}`;
        });
        headers['Actions'] = actionStrings.join('; ');
      }

      // Use fetch to send notification
      const response = await fetch(ntfyUrl, {
        method: 'POST',
        headers: headers,
        body: message
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const timestamp = new Date().toLocaleString('en-US', { 
        timeZone: 'Europe/Berlin',
        dateStyle: 'short',
        timeStyle: 'short'
      });

      return {
        success: true,
        message: "Notification sent successfully",
        details: {
          topic: ntfyTopic,
          title: title,
          priority: priority,
          tags: tags,
          actions: actions,
          timestamp: timestamp,
          messageLength: message.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to send notification: ${error.message}`,
        troubleshooting: {
          checkNetwork: "Ensure internet connectivity",
          checkTopic: "Verify NTFY_TOPIC environment variable is set",
          checkService: "Test manual notification with: curl -d 'test' ntfy.sh/your-topic"
        }
      };
    }
  }
};
