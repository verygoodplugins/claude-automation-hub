// MCP tool for analyzing automation hub statistics
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

export default {
  name: "analyze_hub_stats",
  description: "Analyze automation hub statistics including workflows, integrations, and usage patterns",
  inputSchema: {
    type: "object",
    properties: {
      includeContent: {
        type: "boolean",
        description: "Whether to analyze workflow content for deeper insights",
        default: false
      }
    }
  },
  handler: async ({ includeContent = false }) => {
    try {
      const stats = {
        workflows: { total: 0, byCategory: {} },
        integrations: new Set(),
        timeEstimates: [],
        lastUpdated: new Date().toISOString()
      };

      // Analyze workflows directory
      const workflowsPath = './workflows';
      const categories = await readdir(workflowsPath);

      for (const category of categories) {
        const categoryPath = join(workflowsPath, category);
        const categoryStat = await stat(categoryPath);
        
        if (categoryStat.isDirectory()) {
          const workflows = await readdir(categoryPath);
          const mdFiles = workflows.filter(f => f.endsWith('.md'));
          
          stats.workflows.byCategory[category] = mdFiles.length;
          stats.workflows.total += mdFiles.length;

          if (includeContent) {
            // Analyze workflow content for integrations and time estimates
            for (const workflow of mdFiles) {
              try {
                const content = await readFile(join(categoryPath, workflow), 'utf-8');
                
                // Extract time estimates
                const timeMatch = content.match(/time saved[:\s]*([^\\n]+)/i);
                if (timeMatch) {
                  stats.timeEstimates.push(timeMatch[1].trim());
                }

                // Extract integration mentions
                const integrationPatterns = [
                  /freescout/gi, /stripe/gi, /cloudflare/gi, /gmail/gi, 
                  /calendar/gi, /filesystem/gi, /spotify/gi, /browser/gi,
                  /postgres/gi, /wordpress/gi
                ];
                
                integrationPatterns.forEach(pattern => {
                  if (pattern.test(content)) {
                    stats.integrations.add(pattern.source.replace(/\\\\[gi]+$/, ''));
                  }
                });
              } catch (err) {
                // Skip files that can't be read
              }
            }
          }
        }
      }

      // Convert Set to Array for JSON serialization
      stats.integrations = Array.from(stats.integrations);

      const summary = `
## Automation Hub Statistics

**Workflows Overview:**
- Total workflows: ${stats.workflows.total}
- Categories: ${Object.keys(stats.workflows.byCategory).length}

**By Category:**
${Object.entries(stats.workflows.byCategory)
  .map(([cat, count]) => `- ${cat}: ${count} workflows`)
  .join('\\n')}

**Detected Integrations:** ${stats.integrations.length}
${stats.integrations.map(i => `- ${i}`).join('\\n')}

${includeContent && stats.timeEstimates.length > 0 ? `
**Time Savings Mentioned:**
${stats.timeEstimates.map(t => `- ${t}`).join('\\n')}
` : ''}

*Analysis completed: ${stats.lastUpdated}*
      `;

      return {
        summary,
        rawStats: stats
      };
    } catch (error) {
      return `Error analyzing hub stats: ${error.message}`;
    }
  }
};
