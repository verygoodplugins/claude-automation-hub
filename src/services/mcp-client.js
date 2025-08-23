/**
 * MCP Client - Manages connections to MCP servers
 * 
 * Reads .mcp.json configuration and establishes connections
 * to MCP servers using the Model Context Protocol
 */

import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './realtime-logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..', '..');

class MCPClient extends EventEmitter {
  constructor() {
    super();
    this.servers = new Map();
    this.config = null;
    this.initialized = false;
  }

  /**
   * Initialize MCP client by reading configuration
   */
  async initialize() {
    if (this.initialized) return;
    
    console.log('🔌 Starting MCP client initialization...');
    
    try {
      // Read .mcp.json configuration
      const configPath = path.join(PROJECT_ROOT, '.mcp.json');
      console.log('📋 Reading MCP config from:', configPath);
      const configContent = await fs.readFile(configPath, 'utf8');
      this.config = JSON.parse(configContent);
      
      console.log('📋 Loaded MCP configuration with servers:', Object.keys(this.config.mcpServers || {}));
      
      // Start configured servers
      await this.startServers();
      
      this.initialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize MCP client:', error);
      throw error;
    }
  }

  /**
   * Start all configured MCP servers
   */
  async startServers() {
    const { mcpServers } = this.config;
    
    for (const [name, serverConfig] of Object.entries(mcpServers)) {
      if (serverConfig.disabled) continue;
      
      try {
        await this.startServer(name, serverConfig);
      } catch (error) {
        console.error(`❌ Failed to start MCP server ${name}:`, error);
      }
    }
  }

  /**
   * Start a single MCP server
   */
  async startServer(name, config) {
    logger.mcpServerStart(name, config);
    
    // Prepare environment variables
    const env = { ...process.env };
    if (config.env) {
      for (const [key, value] of Object.entries(config.env)) {
        // Replace ${VAR} with actual environment variable
        env[key] = value.replace(/\$\{([^}]+)\}/g, (match, varName) => {
          return process.env[varName] || match;
        });
      }
    }
    
    // Spawn the server process
    const serverProcess = spawn(config.command, config.args, {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: config.local ? PROJECT_ROOT : undefined
    });
    
    // Create server object
    const server = {
      name,
      config,
      process: serverProcess,
      tools: new Map(),
      pendingRequests: new Map(),
      nextId: 1,
      buffer: ''
    };
    
    // Handle server output (JSON-RPC over stdio)
    serverProcess.stdout.on('data', (data) => {
      this.handleServerOutput(server, data);
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`[${name}] Error:`, data.toString());
    });
    
    serverProcess.on('close', (code) => {
      console.log(`[${name}] Server closed with code ${code}`);
      this.servers.delete(name);
    });
    
    // Initialize the server (get capabilities)
    await this.initializeServer(server);
    
    // Store server
    this.servers.set(name, server);
    
    logger.mcpServerReady(name, server.tools.size);
    console.log(`✅ MCP server ${name} started with ${server.tools.size} tools`);
  }

  /**
   * Initialize server and get its capabilities
   */
  async initializeServer(server) {
    // Send initialize request
    const initResponse = await this.sendRequest(server, 'initialize', {
      protocolVersion: '0.1.0',
      capabilities: {},
      clientInfo: {
        name: 'claude-automation-hub',
        version: '1.0.0'
      }
    });
    
    // Get available tools
    const toolsResponse = await this.sendRequest(server, 'tools/list', {});
    
    if (toolsResponse.tools) {
      for (const tool of toolsResponse.tools) {
        server.tools.set(tool.name, tool);
      }
    }
  }

  /**
   * Send a JSON-RPC request to an MCP server
   */
  sendRequest(server, method, params) {
    return new Promise((resolve, reject) => {
      const id = server.nextId++;
      
      const request = {
        jsonrpc: '2.0',
        method,
        params,
        id
      };
      
      // Store pending request
      server.pendingRequests.set(id, { resolve, reject });
      
      // Send request
      server.process.stdin.write(JSON.stringify(request) + '\n');
      
      // Set timeout
      setTimeout(() => {
        if (server.pendingRequests.has(id)) {
          server.pendingRequests.delete(id);
          reject(new Error(`Request ${method} timed out`));
        }
      }, 30000);
    });
  }

  /**
   * Handle output from MCP server
   */
  handleServerOutput(server, data) {
    server.buffer += data.toString();
    
    // Process complete JSON-RPC messages
    const lines = server.buffer.split('\n');
    server.buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const message = JSON.parse(line);
        
        // Handle response
        if (message.id !== undefined && server.pendingRequests.has(message.id)) {
          const { resolve, reject } = server.pendingRequests.get(message.id);
          server.pendingRequests.delete(message.id);
          
          if (message.error) {
            reject(new Error(message.error.message));
          } else {
            resolve(message.result);
          }
        }
        
        // Handle notifications
        if (message.method && !message.id) {
          this.emit('notification', {
            server: server.name,
            method: message.method,
            params: message.params
          });
        }
      } catch (error) {
        console.error(`Failed to parse server output:`, error);
      }
    }
  }

  /**
   * Call a tool on an MCP server
   */
  async callTool(serverName, toolName, args) {
    const server = this.servers.get(serverName);
    if (!server) {
      throw new Error(`MCP server ${serverName} not found`);
    }
    
    const tool = server.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found on server ${serverName}`);
    }
    
    const startTime = Date.now();
    logger.mcpToolCall(serverName, toolName, args);
    console.log(`🔧 Calling ${serverName}.${toolName}`, args);
    
    try {
      const result = await this.sendRequest(server, 'tools/call', {
        name: toolName,
        arguments: args
      });
      
      const endTime = Date.now();
      logger.mcpToolResult(serverName, toolName, result, endTime - startTime);
      return result;
    } catch (error) {
      logger.mcpError(serverName, error);
      console.error(`❌ Tool call failed:`, error);
      throw error;
    }
  }

  /**
   * Get all available tools from all servers
   */
  getAllTools() {
    const allTools = [];
    
    for (const [serverName, server] of this.servers) {
      for (const [toolName, tool] of server.tools) {
        allTools.push({
          server: serverName,
          name: toolName,
          description: tool.description,
          inputSchema: tool.inputSchema,
          fullName: `${serverName}.${toolName}`
        });
      }
    }
    
    return allTools;
  }

  /**
   * Find a tool by name across all servers
   */
  findTool(toolName) {
    // Check if it's a full name (server.tool)
    if (toolName.includes('.')) {
      const [serverName, name] = toolName.split('.');
      const server = this.servers.get(serverName);
      if (server && server.tools.has(name)) {
        return {
          server: serverName,
          tool: server.tools.get(name)
        };
      }
    }
    
    // Search all servers for the tool
    for (const [serverName, server] of this.servers) {
      if (server.tools.has(toolName)) {
        return {
          server: serverName,
          tool: server.tools.get(toolName)
        };
      }
    }
    
    return null;
  }

  /**
   * Shutdown all MCP servers
   */
  async shutdown() {
    console.log('🛑 Shutting down MCP servers...');
    
    for (const [name, server] of this.servers) {
      try {
        // Send shutdown request
        await this.sendRequest(server, 'shutdown', {});
      } catch (error) {
        // Server might already be down
      }
      
      // Kill process
      server.process.kill();
    }
    
    this.servers.clear();
    this.initialized = false;
  }
}

// Export singleton instance
const mcpClient = new MCPClient();
export { mcpClient };