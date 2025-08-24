#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new Server(
  {
    name: 'automation-hub',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool loading with hot-reload support - use absolute path
const toolsDir = path.join(__dirname, 'tools');
const loadedTools = new Map();

async function loadTools() {
  try {
    const files = await fs.readdir(toolsDir);
    const jsFiles = files.filter(file => file.endsWith('.js') && file !== 'README.md');
    
    for (const file of jsFiles) {
      const filePath = path.join(toolsDir, file);
      const fileURL = pathToFileURL(path.resolve(filePath)).href;
      
      try {
        // Dynamic import with cache busting for hot reload
        const module = await import(`${fileURL}?t=${Date.now()}`);
        const tool = module.default;
        
        if (tool && tool.name) {
          loadedTools.set(tool.name, tool);
        }
      } catch (error) {
        console.error(`Error loading tool ${file}:`, error.message);
      }
    }
    
    console.error(`Loaded ${loadedTools.size} tools:`, Array.from(loadedTools.keys()));
  } catch (error) {
    console.error('Error loading tools:', error.message);
  }
}

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Array.from(loadedTools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const tool = loadedTools.get(name);
  if (!tool) {
    throw new Error(`Tool ${name} not found`);
  }
  
  try {
    const result = await tool.handler(args || {});
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    throw new Error(`Tool ${name} failed: ${error.message}`);
  }
});

// Start server
async function main() {
  console.error('Starting automation-hub MCP server...');
  await loadTools();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Automation hub MCP server running on stdio');
}

main().catch(console.error);