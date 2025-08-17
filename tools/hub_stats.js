/**
 * Hub Stats Analyzer
 * Analyzes your automation hub usage and provides insights
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export default {
  name: "analyze_hub_stats",
  description: "Analyze your automation hub usage statistics and get insights",
  inputSchema: {
    type: "object",
    properties: {
      period: {
        type: "string",
        enum: ["week", "month", "all"],
        default: "week",
        description: "Time period to analyze"
      },
      detailed: {
        type: "boolean",
        default: false,
        description: "Include detailed breakdown"
      }
    }
  },
  
  handler: async ({ period = "week", detailed = false }) => {
    try {
      // Get all workflow files
      const workflowDirs = ['daily', 'weekly', 'monthly', 'on-demand'];
      let totalWorkflows = 0;
      let totalTimeSaved = 0;
      let workflowStats = [];
      
      for (const dir of workflowDirs) {
        const dirPath = join('./workflows', dir);
        try {
          const files = await readdir(dirPath);
          const mdFiles = files.filter(f => f.endsWith('.md'));
          
          for (const file of mdFiles) {
            const content = await readFile(join(dirPath, file), 'utf-8');
            totalWorkflows++;
            
            // Extract time saved from content
            const timeSavedMatch = content.match(/\*\*Saved: (\d+)[\s-]+(?:minutes|hours)/i);
            if (timeSavedMatch) {
              const value = parseInt(timeSavedMatch[1]);
              const unit = content.match(/hours/i) ? 60 : 1;
              totalTimeSaved += value * unit;
              
              workflowStats.push({
                name: file.replace('.md', ''),
                category: dir,
                timeSaved: value * unit,
                path: `${dir}/${file}`
              });
            }
          }
        } catch (err) {
          // Directory might not exist
          continue;
        }
      }
      
      // Sort by time saved
      workflowStats.sort((a, b) => b.timeSaved - a.timeSaved);
      
      const result = {
        summary: {
          totalWorkflows,
          totalTimeSavedMinutes: totalTimeSaved,
          totalTimeSavedHours: Math.round(totalTimeSaved / 60 * 10) / 10,
          averageTimeSavedPerWorkflow: Math.round(totalTimeSaved / totalWorkflows),
          period
        },
        topWorkflows: workflowStats.slice(0, 5).map(w => ({
          name: w.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          timeSaved: `${w.timeSaved} minutes`,
          category: w.category
        })),
        categoryBreakdown: {
          daily: workflowStats.filter(w => w.category === 'daily').length,
          weekly: workflowStats.filter(w => w.category === 'weekly').length,
          monthly: workflowStats.filter(w => w.category === 'monthly').length,
          onDemand: workflowStats.filter(w => w.category === 'on-demand').length
        }
      };
      
      if (detailed) {
        result.allWorkflows = workflowStats;
      }
      
      // Calculate projections
      result.projections = {
        weeklyImpact: `${Math.round(totalTimeSaved * 7 / 60)} hours`,
        monthlyImpact: `${Math.round(totalTimeSaved * 30 / 60)} hours`,
        yearlyImpact: `${Math.round(totalTimeSaved * 365 / 60)} hours`,
        dollarValue: `$${Math.round(totalTimeSaved * 365 / 60 * 100)}` // Assuming $100/hour value
      };
      
      return {
        success: true,
        data: result,
        message: `Analysis complete: ${totalWorkflows} workflows saving ${result.summary.totalTimeSavedHours} hours`
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        help: "Ensure you're running this from the automation hub root directory"
      };
    }
  }
};
