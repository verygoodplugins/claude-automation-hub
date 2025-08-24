---
name: session-end-memory-hook
trigger: session_end
agents: session-memory-capturer, doc-conflict-resolver, session-cleanup, config-synchronizer
---

When a Claude Code session ends, automatically run FOUR agents in parallel:
1. **session-memory-capturer**: Capture project-specific memories
2. **doc-conflict-resolver**: Check for documentation conflicts
3. **session-cleanup**: Clean up temporary files
4. **config-synchronizer**: Sync example configurations

## Parallel Execution Strategy

All four agents run simultaneously and coordinate through the MCP Memory Service:

### Memory Capture (Always runs)
The session-memory-capturer agent will:
- Analyze git changes from the session
- Identify key decisions made
- Document solutions found
- Note failed attempts
- Create session summary
- Store everything in MCP Memory Service

### Documentation Check (If docs changed)
The doc-conflict-resolver agent will:
- Scan for conflicts between documentation files
- Fix simple issues automatically
- Report complex conflicts for review
- Store findings in memory for other agents

### Session Cleanup (Always runs)
The session-cleanup agent will:
- Remove temporary test files
- Archive abandoned markdown files
- Update .gitignore with new patterns
- Store cleanup summary in memory
- Check memory for frequently used temp files to preserve

### Config Synchronization (If config changed)
The config-synchronizer agent will:
- Compare actual config with examples
- Update example configurations
- Add helpful comments for users
- Store config changes in memory
- Coordinate with doc-resolver for documentation updates

## Agent Coordination Through Memory

Agents share information via MCP Memory Service:

```
session-cleanup: "Archived old-mcp-setup.md to docs/archive/"
     ↓
doc-conflict-resolver: Checks memory, skips archived file
     ↓
config-synchronizer: "Updated MCP examples with new format"
     ↓
session-memory-capturer: Includes all agent actions in session summary
```

## Execution Conditions
- Skip if session < 10 minutes
- Skip memory capture if no files changed
- Skip doc check if no .md files changed
- Skip config sync if no config files changed
- Always run cleanup for sessions > 30 minutes
- Always run all if session lasted > 2 hours (likely significant work)

## Success Criteria
- At least one memory is stored (if work was done)
- Documentation conflicts are identified (if docs changed)
- Temporary files are cleaned (if any exist)
- Config examples match actual (if configs changed)
- Reports are generated in .claude/reports/

## Memory Tags Applied
All session memories get:
- "claude-automation-hub"
- Current date as "2025-01-10" format
- Session type: "quick" (<30min), "normal" (30min-2hr), "extended" (>2hr)
- Productivity: "exploratory", "productive", "breakthrough"
- Agent-specific tags: "cleanup", "config-sync", "doc-check", "session-summary"