export default {
  // Server configuration
  server: {
    name: 'automation-hub',
    version: '1.0.0'
  },
  
  // Directory to watch for tools
  toolsDir: './tools',
  
  // File patterns to watch
  watchPatterns: ['./tools/**/*.js'],
  
  // Suppress console output from tools
  silent: true,
  
  // Redirect console.log to console.error for MCP compatibility
  redirectConsole: true,
  
  // Custom tool loader that wraps console.log
  onToolLoad: (tool) => {
    // Store original console.log
    const originalLog = console.log;
    
    // Override console.log during tool loading
    console.log = console.error;
    
    // Restore after loading
    process.nextTick(() => {
      console.log = originalLog;
    });
    
    return tool;
  }
};