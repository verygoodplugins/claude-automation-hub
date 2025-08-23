# Notification Assistant

Send or manage notification: $ARGUMENTS

## Task

I'll help you with mobile notifications by:

1. Sending push notifications via NTFY
2. Managing notification bundling and priorities
3. Creating context-aware action buttons
4. Testing notification delivery
5. Debugging notification issues
6. Setting up mobile handoffs

## Notification Features

### Priority Levels
- `max`: Urgent, bypasses bundling
- `high`: Important, may bundle
- `default`: Normal priority
- `low`: Background info
- `min`: Silent/logged only

### Smart Bundling
- Max 4 notifications per bundle
- 30-minute bundling windows
- Automatic grouping by type
- Context preservation for mobile

### Action Buttons
- "Ask Claude": Opens with context
- "Reschedule": Delays task
- "Next Task": Moves to next item
- Custom actions per workflow

## Process

1. Determine notification type and priority
2. Check bundling rules and windows
3. Create notification with proper formatting
4. Add relevant action buttons
5. Store context in OpenMemory for handoff
6. Send via NTFY to mobile device

## Testing Commands

```bash
# Test basic notification
npm run test-mobile

# Test bundling system
npm run test-bundled

# Debug notification flow
node debug-notifications.js
```

## Integration Points

- Workflow completions
- Error alerts
- Schedule reminders
- Support ticket updates
- System status changes

I'll help you implement effective mobile notifications that keep you informed without overwhelming you.