/**
 * Slack Response Handler
 * 
 * Handles delayed responses and rich formatting for Slack
 */

import fetch from 'node-fetch';

class SlackResponseHandler {
  constructor() {
    this.maxMessageLength = 3000; // Slack's limit
  }
  
  /**
   * Send a delayed response to Slack using response_url
   */
  async sendDelayedResponse(responseUrl, message, options = {}) {
    try {
      const payload = this.formatMessage(message, options);
      
      const response = await fetch(responseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Slack returned ${response.status}`);
      }
      
      console.log('✅ Sent delayed response to Slack');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send delayed response:', error);
      return false;
    }
  }
  
  /**
   * Format message for Slack with rich blocks
   */
  formatMessage(message, options = {}) {
    const {
      responseType = 'in_channel',
      threadTs = null,
      attachments = [],
      blocks = null,
      toolsUsed = []
    } = options;
    
    // If blocks are provided, use them directly
    if (blocks) {
      return {
        response_type: responseType,
        thread_ts: threadTs,
        blocks: blocks,
        attachments: attachments
      };
    }
    
    // Otherwise, create blocks from the message
    const messageBlocks = [];
    
    // Add header if Claude is responding
    messageBlocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: '🤖 Claude Response',
        emoji: true
      }
    });
    
    // Split long messages into multiple blocks
    const chunks = this.splitMessage(message);
    for (const chunk of chunks) {
      messageBlocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: chunk
        }
      });
    }
    
    // Add tools used footer if any
    if (toolsUsed.length > 0) {
      messageBlocks.push({
        type: 'divider'
      });
      
      const toolsList = toolsUsed.map(t => `• ${t.tool}`).join('\n');
      messageBlocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🔧 *Tools used:*\n${toolsList}`
          }
        ]
      });
    }
    
    // Add action buttons if needed
    if (options.actions) {
      messageBlocks.push({
        type: 'actions',
        elements: options.actions
      });
    }
    
    return {
      response_type: responseType,
      thread_ts: threadTs,
      blocks: messageBlocks,
      attachments: attachments
    };
  }
  
  /**
   * Split long messages into chunks
   */
  splitMessage(message) {
    if (message.length <= this.maxMessageLength) {
      return [message];
    }
    
    const chunks = [];
    let currentChunk = '';
    const lines = message.split('\n');
    
    for (const line of lines) {
      if ((currentChunk + line + '\n').length > this.maxMessageLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        
        // If a single line is too long, split it
        if (line.length > this.maxMessageLength) {
          const words = line.split(' ');
          for (const word of words) {
            if ((currentChunk + word + ' ').length > this.maxMessageLength) {
              chunks.push(currentChunk.trim());
              currentChunk = word + ' ';
            } else {
              currentChunk += word + ' ';
            }
          }
        } else {
          currentChunk = line + '\n';
        }
      } else {
        currentChunk += line + '\n';
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
  
  /**
   * Create error message block
   */
  createErrorBlock(error) {
    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `❌ *Error:* ${error}`
        }
      }
    ];
  }
  
  /**
   * Create loading message
   */
  createLoadingBlock(message = 'Claude is thinking...') {
    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `⏳ *${message}*`
        }
      }
    ];
  }
  
  /**
   * Create success message with actions
   */
  createSuccessBlock(message, actions = []) {
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ ${message}`
        }
      }
    ];
    
    if (actions.length > 0) {
      blocks.push({
        type: 'actions',
        elements: actions
      });
    }
    
    return blocks;
  }
  
  /**
   * Format code block for Slack
   */
  formatCodeBlock(code, language = '') {
    return '```' + language + '\n' + code + '\n```';
  }
  
  /**
   * Format list for Slack
   */
  formatList(items, ordered = false) {
    return items.map((item, index) => {
      const prefix = ordered ? `${index + 1}.` : '•';
      return `${prefix} ${item}`;
    }).join('\n');
  }
}

export { SlackResponseHandler };