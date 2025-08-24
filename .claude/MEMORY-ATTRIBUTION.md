# Memory Attribution Guide for Claude Automation Hub Agents

## The Problem
With multiple agents writing to the same memory system, we need clear attribution to distinguish:
- **Human memories**: Your personal knowledge, decisions, and insights
- **Agent memories**: Automated captures from subagents

## The Solution: Clear Attribution Markers

### Agent Memory Format
All agent-generated memories follow this format:
```
[AGENT:agent-name] Memory content here...
```

### Required Tags for Agent Memories
Every agent memory MUST include these tags:
1. `"agent-generated"` - Universal identifier for agent memories
2. `"[specific-agent-name]"` - Which agent created it
3. `"automated"` - Indicates automated capture
4. `"claude-automation-hub"` - Project scope

## Examples

### Human Memory (created by you)
```
Content: "Decided to use WebSockets instead of polling for real-time updates"
Tags: ["decision", "architecture", "websockets"]
```

### Agent Memory (created by agent)
```
Content: "[AGENT:session-cleanup] Removed 5 temp files, archived 2 docs, saved 12MB"
Tags: ["agent-generated", "session-cleanup", "automated", "claude-automation-hub"]
```

## Querying Memories

### Get only human memories:
```
# Exclude agent-generated memories
memory_retrieve_memory("websockets decision NOT agent-generated")
```

### Get only agent memories:
```
# Search specifically for agent memories
memory_search_by_tag(["agent-generated"])
```

### Get memories from specific agent:
```
# Search for specific agent's memories
memory_search_by_tag(["session-cleanup", "agent-generated"])
```

## Agent Attribution Reference

| Agent | Prefix | Primary Tags |
|-------|--------|--------------|
| project-memory-keeper | `[AGENT:project-memory-keeper]` | agent-generated, project-memory-keeper, automated |
| session-memory-capturer | `[AGENT:session-memory-capturer]` | agent-generated, session-memory-capturer, automated |
| doc-conflict-resolver | `[AGENT:doc-conflict-resolver]` | agent-generated, doc-conflict-resolver, automated |
| session-cleanup | `[AGENT:session-cleanup]` | agent-generated, session-cleanup, automated |
| config-synchronizer | `[AGENT:config-synchronizer]` | agent-generated, config-synchronizer, automated |

## Benefits of This System

1. **Trust**: You always know if a memory came from you or an agent
2. **Filtering**: Easy to query only human or only agent memories
3. **Debugging**: Track what each agent is storing
4. **Transparency**: Clear audit trail of automated actions
5. **Control**: Can bulk delete agent memories if needed

## Bulk Operations

### Delete all agent memories (if needed):
```
memory_search_by_tag(["agent-generated"])
# Then delete specific ones or all
```

### Get agent activity summary:
```
memory_search_by_tag(["agent-generated", "session-summary"])
# Shows all session summaries from agents
```

### Find patterns discovered by agents:
```
memory_search_by_tag(["agent-generated", "pattern"])
# Shows all patterns discovered automatically
```

## Implementation Status
✅ All 5 agents updated with attribution
✅ Consistent prefix format: `[AGENT:name]`
✅ Required tags enforced
✅ Clear separation from human memories

This system ensures your personal memory space remains distinct while benefiting from automated intelligence gathering.