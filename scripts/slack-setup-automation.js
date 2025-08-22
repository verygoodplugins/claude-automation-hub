// Slack App Automation Script
// This will configure all your Slack app settings automatically

async function setupSlackApp() {
    console.log('🚀 Starting Slack App Setup Automation...');
    
    // Configuration for your app
    const config = {
        requestUrl: 'https://automation.verygoodplugins.com',
        botEvents: [
            'app_mention',
            'app_home_opened',
            'message.channels',
            'message.groups', 
            'message.im',
            'message.mpim',
            'member_joined_channel',
            'reaction_added',
            'file_shared'
        ],
        userEvents: [
            'message',
            'reaction_added'
        ],
        shortcuts: [
            {
                name: 'AI Summary',
                description: 'Summarize conversation with AI',
                type: 'message'
            },
            {
                name: 'Create WP Post',
                description: 'Create WordPress post from message',
                type: 'message'
            }
        ],
        slashCommands: [
            {
                command: '/claude',
                description: 'Chat with Claude AI',
                usage: '[your message]'
            },
            {
                command: '/wppost',
                description: 'Create WP Fusion post',
                usage: '[title] | [content]'
            }
        ]
    };
    
    // Step 1: Event Subscriptions
    console.log('📬 Setting up Event Subscriptions...');
    
    // Navigate to Event Subscriptions if not there
    if (!window.location.href.includes('event-subscriptions')) {
        window.location.href = 'https://api.slack.com/apps/A09BXT36N57/event-subscriptions';
        return 'Navigating to Event Subscriptions...';
    }
    
    // Set Request URL
    const urlInput = document.querySelector('input[name="url"]');
    if (urlInput) {
        urlInput.value = config.requestUrl + '/slack/events';
        urlInput.dispatchEvent(new Event('input', { bubbles: true }));
        urlInput.dispatchEvent(new Event('blur', { bubbles: true }));
    }
    
    // Enable events
    const enableToggle = document.querySelector('input[type="checkbox"][name="enabled"]');
    if (enableToggle && !enableToggle.checked) {
        enableToggle.click();
    }
    
    // Add bot events
    const addEventButton = document.querySelector('button[data-qa="add_bot_event_button"]');
    if (addEventButton) {
        for (let event of config.botEvents) {
            // Check if event already exists
            const existingEvent = document.querySelector(`[data-qa="bot_event_${event}"]`);
            if (!existingEvent) {
                addEventButton.click();
                await new Promise(r => setTimeout(r, 500));
                
                // Select the event from dropdown
                const selects = document.querySelectorAll('select');
                const lastSelect = selects[selects.length - 1];
                if (lastSelect) {
                    lastSelect.value = event;
                    lastSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    }
    
    // Save changes
    const saveButton = document.querySelector('button[data-qa="save_changes_button"]');
    if (saveButton && !saveButton.disabled) {
        saveButton.click();
        console.log('✅ Event Subscriptions configured!');
    }
    
    return 'Event Subscriptions setup complete!';
}

// Run the automation
setupSlackApp();
