/**
 * Slack Workflow Steps Implementation
 * Integrates with MCP tools for WP Fusion, Very Good Plugins, and more
 */

import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your Slack app credentials (set these in environment)
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;    // Required for Slack API (xoxb-)
const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN;  // Required for MCP ops (xoxp-)

// Verify Slack requests
function verifySlackRequest(req) {
    const signature = req.headers['x-slack-signature'];
    const timestamp = req.headers['x-slack-request-timestamp'];
    const body = JSON.stringify(req.body);
    
    const sigBasestring = 'v0:' + timestamp + ':' + body;
    const mySignature = 'v0=' + crypto
        .createHmac('sha256', SLACK_SIGNING_SECRET)
        .update(sigBasestring)
        .digest('hex');
    
    return signature === mySignature;
}

// Workflow Step Definitions
const WORKFLOW_STEPS = {
    // WP Fusion Content Management
    'wpfusion_create_post': {
        name: 'Create WP Fusion Post',
        callback_id: 'wpfusion_create_post',
        inputs: [
            { name: 'title', label: 'Post Title', type: 'text', required: true },
            { name: 'content', label: 'Content', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Updates', 'Documentation', 'Release Notes'] }
        ],
        outputs: [
            { name: 'post_id', label: 'Post ID', type: 'text' },
            { name: 'post_url', label: 'Post URL', type: 'text' }
        ]
    },
    
    // Very Good Plugins Support
    'vgp_create_documentation': {
        name: 'Create VGP Documentation',
        callback_id: 'vgp_create_documentation',
        inputs: [
            { name: 'title', label: 'Doc Title', type: 'text', required: true },
            { name: 'content', label: 'Documentation', type: 'text', required: true },
            { name: 'product', label: 'Product', type: 'select', options: ['WP Fusion', 'If-So', 'Other'] }
        ],
        outputs: [
            { name: 'doc_id', label: 'Documentation ID', type: 'text' },
            { name: 'doc_url', label: 'Documentation URL', type: 'text' }
        ]
    },
    
    // FreeScout Ticket Creation
    'freescout_ticket': {
        name: 'Create Support Ticket',
        callback_id: 'freescout_ticket',
        inputs: [
            { name: 'customer_email', label: 'Customer Email', type: 'email', required: true },
            { name: 'subject', label: 'Subject', type: 'text', required: true },
            { name: 'message', label: 'Message', type: 'text', required: true },
            { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Normal', 'High', 'Urgent'] }
        ],
        outputs: [
            { name: 'ticket_id', label: 'Ticket ID', type: 'text' },
            { name: 'ticket_url', label: 'Ticket URL', type: 'text' }
        ]
    },
    
    // AI Summary from Slack
    'ai_channel_summary': {
        name: 'AI Channel Summary',
        callback_id: 'ai_channel_summary',
        inputs: [
            { name: 'channel_id', label: 'Channel', type: 'channel', required: true },
            { name: 'message_count', label: 'Number of Messages', type: 'number', default: 50 },
            { name: 'summary_type', label: 'Summary Type', type: 'select', options: ['Key Points', 'Action Items', 'Decisions', 'Full Summary'] }
        ],
        outputs: [
            { name: 'summary', label: 'Summary', type: 'text' },
            { name: 'action_items', label: 'Action Items', type: 'text' }
        ]
    },
    
    // Memory Storage
    'save_to_memory': {
        name: 'Save to OpenMemory',
        callback_id: 'save_to_memory',
        inputs: [
            { name: 'content', label: 'Content to Remember', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Decision', 'Process', 'Customer Info', 'Technical'] }
        ],
        outputs: [
            { name: 'memory_id', label: 'Memory ID', type: 'text' },
            { name: 'confirmation', label: 'Saved', type: 'text' }
        ]
    },
    
    // Automation Hub Notification
    'send_notification': {
        name: 'Send Automation Alert',
        callback_id: 'send_notification',
        inputs: [
            { name: 'message', label: 'Alert Message', type: 'text', required: true },
            { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'default', 'high', 'urgent'] },
            { name: 'actions', label: 'Include Actions', type: 'boolean', default: false }
        ],
        outputs: [
            { name: 'notification_sent', label: 'Sent', type: 'boolean' }
        ]
    }
};

// Workflow configuration endpoint
app.post('/slack/workflow/config', async (req, res) => {
    if (!verifySlackRequest(req)) {
        return res.status(401).send('Unauthorized');
    }
    
    const { callback_id } = req.body;
    const step = WORKFLOW_STEPS[callback_id];
    
    if (!step) {
        return res.status(404).json({ error: 'Unknown workflow step' });
    }
    
    // Return configuration for Slack
    res.json({
        step: {
            name: step.name,
            callback_id: step.callback_id,
            inputs: step.inputs,
            outputs: step.outputs
        }
    });
});

// Workflow execution endpoint
app.post('/slack/workflow/execute', async (req, res) => {
    if (!verifySlackRequest(req)) {
        return res.status(401).send('Unauthorized');
    }
    
    const { callback_id, inputs, workflow_step } = req.body;
    
    try {
        let outputs = {};
        
        switch (callback_id) {
            case 'wpfusion_create_post':
                // Call WP Fusion MCP to create post
                outputs = await createWPFusionPost(inputs);
                break;
                
            case 'vgp_create_documentation':
                // Call Very Good Plugins MCP to create doc
                outputs = await createVGPDocumentation(inputs);
                break;
                
            case 'freescout_ticket':
                // Call FreeScout MCP to create ticket
                outputs = await createFreeScoutTicket(inputs);
                break;
                
            case 'ai_channel_summary':
                // Call Slack MCP to get messages, then Claude to summarize
                outputs = await generateChannelSummary(inputs);
                break;
                
            case 'save_to_memory':
                // Call OpenMemory MCP to save
                outputs = await saveToMemory(inputs);
                break;
                
            case 'send_notification':
                // Send notification via ntfy
                outputs = await sendNotification(inputs);
                break;
        }
        
        // Mark step as completed
        await completeWorkflowStep(workflow_step.workflow_step_execute_id, outputs);
        res.status(200).send();
        
    } catch (error) {
        console.error('Workflow execution error:', error);
        await failWorkflowStep(workflow_step.workflow_step_execute_id, error.message);
        res.status(500).json({ error: error.message });
    }
});

// Implementation functions that call MCP tools
async function createWPFusionPost(inputs) {
    // This would call your WP Fusion MCP server
    // For now, returning mock data
    return {
        post_id: '123',
        post_url: 'https://wpfusion.com/post/123'
    };
}

async function createVGPDocumentation(inputs) {
    // Call Very Good Plugins MCP
    return {
        doc_id: '456',
        doc_url: 'https://verygoodplugins.com/docs/456'
    };
}

async function createFreeScoutTicket(inputs) {
    // Call FreeScout MCP
    return {
        ticket_id: '789',
        ticket_url: 'https://support.verygoodplugins.com/ticket/789'
    };
}

async function generateChannelSummary(inputs) {
    // Call Slack MCP to get messages, then use Claude
    return {
        summary: 'Channel summary generated',
        action_items: '1. Follow up on...'
    };
}

async function saveToMemory(inputs) {
    // Call OpenMemory MCP
    return {
        memory_id: 'mem_123',
        confirmation: 'Saved to memory'
    };
}

async function sendNotification(inputs) {
    // Send via ntfy
    return {
        notification_sent: true
    };
}

// Helper functions for Slack API
async function completeWorkflowStep(executeId, outputs) {
    const response = await fetch('https://slack.com/api/workflows.stepCompleted', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,  // Slack API requires bot token
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            workflow_step_execute_id: executeId,
            outputs
        })
    });
    return response.json();
}

async function failWorkflowStep(executeId, error) {
    const response = await fetch('https://slack.com/api/workflows.stepFailed', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,  // Slack API requires bot token
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            workflow_step_execute_id: executeId,
            error: { message: error }
        })
    });
    return response.json();
}

// Start server
const PORT = process.env.PORT || 8765;
app.listen(PORT, () => {
    console.log(`🚀 Slack Workflow Steps server running on port ${PORT}`);
    console.log(`📍 Endpoints:`);
    console.log(`   POST /slack/workflow/config`);
    console.log(`   POST /slack/workflow/execute`);
});

export default app;
