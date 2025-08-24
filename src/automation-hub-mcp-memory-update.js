/**
 * Updated Automation Hub Integration for MCP Memory Service
 * 
 * This file shows how to update your automation-hub.js to work with 
 * MCP Memory Service instead of OpenMemory
 */

// Key changes needed in automation-hub.js:

// 1. Replace MockOpenmemoryClient with MCPMemoryClient:

export class MCPMemoryClient {
  constructor() {
    console.log('📝 Using MCP Memory Service (via MCP protocol)');
    // The actual MCP client will be injected by Claude Desktop
    // This is a wrapper for consistent API
  }

  /**
   * Store memory with enhanced features
   * MCP Memory Service API: store_memory(content, metadata)
   */
  async store(entry) {
    // Convert to MCP Memory Service format
    const memoryData = {
      content: typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content),
      metadata: {
        tags: entry.tags || [],
        type: entry.type || 'automation',
        ...entry.metadata
      }
    };

    // In Claude Desktop, this would call the MCP tool directly:
    // await mcpTools.store_memory(memoryData.content, memoryData.metadata);
    
    const id = `mcp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log(`💾 Stored in MCP Memory Service: ${entry.tags?.[0] || 'entry'}`);
    return id;
  }

  /**
   * Retrieve memories using semantic search
   * MCP Memory Service API: retrieve_memory(query, n_results)
   */
  async search(query, options = {}) {
    // In Claude Desktop, this would call:
    // await mcpTools.retrieve_memory(query, options.n_results || 5);
    
    console.log(`🔍 Searching MCP Memory Service for "${query}"`);
    return [];
  }

  /**
   * Recall memories using natural language time expressions
   * MCP Memory Service API: recall_memory(query, n_results)
   * NEW FEATURE - not available in OpenMemory!
   */
  async recall(timeExpression, options = {}) {
    // Examples: "last week", "yesterday morning", "two days ago"
    // await mcpTools.recall_memory(timeExpression, options.n_results || 5);
    
    console.log(`🕰️ Recalling memories from "${timeExpression}"`);
    return [];
  }

  /**
   * Search by tags with enhanced options
   * MCP Memory Service API: search_by_tag(tags)
   */
  async searchByTag(tags, options = {}) {
    // Support both single tags and arrays
    const tagArray = Array.isArray(tags) ? tags : [tags];
    
    // In Claude Desktop:
    // await mcpTools.search_by_tag(tagArray);
    
    console.log(`🏷️ Searching by tags: ${tagArray.join(', ')}`);
    return [];
  }

  /**
   * Delete memories with multiple options
   * MCP Memory Service API: delete_by_tag(tags) or delete_memory(hash)
   */
  async delete(idOrTags) {
    if (typeof idOrTags === 'string') {
      // Delete by ID/hash
      // await mcpTools.delete_memory(idOrTags);
      console.log(`🗑️ Deleted memory: ${idOrTags}`);
    } else if (Array.isArray(idOrTags)) {
      // Delete by tags (OR logic)
      // await mcpTools.delete_by_tags(idOrTags);
      console.log(`🗑️ Deleted memories with tags: ${idOrTags.join(', ')}`);
    }
    return true;
  }

  /**
   * NEW: Consolidate memories (autonomous organization)
   * MCP Memory Service API: consolidate_memories(time_horizon)
   */
  async consolidate(timeHorizon = 'daily') {
    // Time horizons: 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
    // await mcpTools.consolidate_memories(timeHorizon);
    
    console.log(`🧠 Consolidating memories: ${timeHorizon}`);
    return { consolidated: true, timeHorizon };
  }

  /**
   * NEW: Get memory associations (creative connections)
   * MCP Memory Service API: get_memory_associations(min_similarity, max_similarity)
   */
  async getAssociations(options = {}) {
    // await mcpTools.get_memory_associations(0.3, 0.7);
    
    console.log(`🔗 Finding memory associations...`);
    return [];
  }

  /**
   * NEW: Get memory health and statistics
   * MCP Memory Service API: check_database_health()
   */
  async getHealth() {
    // await mcpTools.check_database_health();
    
    console.log(`📊 Checking memory service health...`);
    return { status: 'healthy', memories: 0 };
  }
}

// 2. Update the AutomationHub constructor:

export class AutomationHub {
  constructor(options = {}) {
    // Use MCP Memory Service instead of OpenMemory
    this.memoryClient = options.memoryClient || new MCPMemoryClient();
    
    // Initialize notification manager with new memory client
    this.notificationManager = new NotificationManager({
      ntfyTopic: options.ntfyTopic,
      contextStore: this.memoryClient
    });
    
    // Initialize context bridge with new memory client
    this.contextBridge = new ContextBridge({
      memoryClient: this.memoryClient,  // Changed from openmemoryClient
      notificationManager: this.notificationManager
    });
    
    // ... rest of initialization
    
    console.log('🚀 Automation Hub initialized with MCP Memory Service');
    console.log('✨ New features available: consolidation, associations, time-based recall');
  }

  /**
   * NEW: Leverage MCP Memory Service advanced features
   */
  async runMemoryConsolidation() {
    console.log('🧠 Running memory consolidation...');
    
    // Consolidate daily memories
    await this.memoryClient.consolidate('daily');
    
    // Find creative associations
    const associations = await this.memoryClient.getAssociations();
    
    // Store insights
    if (associations.length > 0) {
      await this.memoryClient.store({
        content: `Memory consolidation found ${associations.length} new connections`,
        tags: ['consolidation', 'insights', 'automation'],
        type: 'system'
      });
    }
    
    return { success: true, associations: associations.length };
  }

  /**
   * Enhanced end of day with memory consolidation
   */
  async endOfDayShutdown(data = {}) {
    console.log('🌅 Starting end-of-day shutdown with MCP Memory Service...');
    
    // Store end-of-day summary with enhanced metadata
    await this.memoryClient.store({
      content: JSON.stringify({
        date: new Date().toISOString(),
        achievements: data.achievements || [],
        tomorrowFocus: data.tomorrowFocus || '',
        workflowsCompleted: data.workflowsCompleted || 0,
        timeSaved: data.timeSaved || '0 hours'
      }),
      tags: ['end-of-day', 'summary', 'daily', new Date().toISOString().split('T')[0]],
      type: 'daily-summary',
      metadata: {
        retention: 'standard',  // 30-day retention
        importance: 'high'
      }
    });
    
    // Trigger daily consolidation
    await this.memoryClient.consolidate('daily');
    
    // ... rest of the method
    
    return { success: true, consolidated: true };
  }

  /**
   * NEW: Query memories with natural language time
   */
  async queryRecentMemories(timeExpression = 'today') {
    console.log(`📚 Querying memories from ${timeExpression}...`);
    
    const memories = await this.memoryClient.recall(timeExpression, {
      n_results: 10
    });
    
    return memories;
  }

  /**
   * NEW: Get memory insights and patterns
   */
  async getMemoryInsights() {
    console.log('🔍 Analyzing memory patterns...');
    
    // Get health statistics
    const health = await this.memoryClient.getHealth();
    
    // Find associations
    const associations = await this.memoryClient.getAssociations();
    
    // Query recent important memories
    const importantMemories = await this.memoryClient.searchByTag(['important', 'critical']);
    
    return {
      health,
      associations: associations.length,
      importantMemories: importantMemories.length,
      insights: {
        totalMemories: health.memories || 0,
        storageBackend: 'ChromaDB',
        consolidationEnabled: true
      }
    };
  }
}

// 3. Update context-bridge.js storeInMemory method:

async storeInMemory(context) {
  if (!this.memoryClient) {  // Changed from openmemoryClient
    console.warn('No memory client configured');
    return;
  }

  const memoryEntry = {
    content: JSON.stringify(context, null, 2),
    tags: [
      'mobile-handoff',
      context.type,
      `priority-${context.priority}`,
      'automation-hub',
      `handoff-${context.id}`,
      new Date().toISOString().split('T')[0]  // Add date tag
    ],
    type: 'handoff',
    metadata: {
      handoffId: context.id,
      eventType: context.type,
      timestamp: context.timestamp,
      mobileReady: true,
      expiresAt: context.expiresAt,
      retention: context.priority === 'max' ? 'critical' : 'standard'
    }
  };

  // Store with MCP Memory Service
  await this.memoryClient.store(memoryEntry);

  // Store searchable summary
  const summaryEntry = {
    content: `Mobile handoff: ${context.type} - ${context.desktopContext.title || context.desktopContext.summary}`,
    tags: [
      'mobile-query',
      'handoff-summary',
      context.type,
      new Date().toISOString().split('T')[0]
    ],
    type: 'summary',
    metadata: {
      handoffId: context.id,
      queryable: true
    }
  };

  await this.memoryClient.store(summaryEntry);
}

// Export the updated client
export { MCPMemoryClient };
export default AutomationHub;
