/**
 * Workflow Template Generator
 * Creates new workflow templates with proper structure
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export default {
  name: "generate_workflow_template",
  description: "Generate a new workflow template with proper structure and formatting",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the workflow (e.g., 'Customer Onboarding')"
      },
      category: {
        type: "string",
        enum: ["daily", "weekly", "monthly", "on-demand"],
        description: "Category for the workflow"
      },
      tools: {
        type: "array",
        items: { type: "string" },
        description: "List of MCP tools used (e.g., ['Gmail', 'FreeScout', 'WhatsApp'])"
      },
      timeSaved: {
        type: "number",
        description: "Estimated time saved in minutes"
      },
      description: {
        type: "string",
        description: "Brief description of what the workflow does"
      }
    },
    required: ["name", "category", "tools", "timeSaved", "description"]
  },
  
  handler: async ({ name, category, tools, timeSaved, description }) => {
    try {
      // Generate filename from name
      const filename = name.toLowerCase().replace(/\s+/g, '-') + '.md';
      const filepath = join('./workflows', category, filename);
      
      // Calculate time saved in appropriate units
      const timeSavedHours = timeSaved >= 60 ? `${Math.round(timeSaved / 60 * 10) / 10} hours` : `${timeSaved} minutes`;
      const manualTime = Math.round(timeSaved * 1.5); // Assume automation is 33% faster
      const manualTimeStr = manualTime >= 60 ? `${Math.round(manualTime / 60 * 10) / 10} hours` : `${manualTime} minutes`;
      
      // Generate the workflow template
      const template = `# ${name}

## Command
\`\`\`
${description}
1. [First step using ${tools[0] || 'MCP tool'}]
2. [Second step - analyze/process data]
3. [Third step - take action]
4. [Fourth step - notify/document]
5. [Fifth step - store for future reference]
\`\`\`

## Prerequisites
${tools.map(tool => `- ${tool} MCP (configured and working)`).join('\n')}

## Frequency
${category === 'daily' ? 'Daily at [TIME] Berlin time' : 
  category === 'weekly' ? 'Weekly - [DAY] at [TIME] Berlin time' :
  category === 'monthly' ? 'Monthly - [DAY] of month at [TIME] Berlin time' :
  'On-demand (triggered by [CONDITION])'}

## Time Saved
- Manual process: ${manualTimeStr}
- With automation: ${Math.round(timeSaved * 0.1)} minutes
- **Saved: ${timeSavedHours}**

## Variables You Can Customize
- \`VARIABLE_1\`: "default_value" 
- \`VARIABLE_2\`: ["option1", "option2"]
- \`VARIABLE_3\`: true/false
- \`VARIABLE_4\`: 7 // days, items, etc.

## Success Metrics
- ✅ [First success criterion]
- ✅ [Second success criterion]
- ✅ [Third success criterion]
- ✅ [Fourth success criterion]
- ✅ [Fifth success criterion]

## Sample Output Format
\`\`\`
🎯 ${name.toUpperCase()} RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUMMARY
• [Key metric 1]: [Value]
• [Key metric 2]: [Value]
• [Key metric 3]: [Value]

📋 DETAILS
[Detailed output structure]

✅ ACTIONS TAKEN
1. [Action 1 completed]
2. [Action 2 completed]
3. [Action 3 completed]

💡 INSIGHTS
• [Key insight 1]
• [Key insight 2]
• [Key insight 3]

📅 NEXT STEPS
• [Follow-up action 1]
• [Follow-up action 2]
\`\`\`

## Related Workflows
- [Related Workflow 1](./related-1.md)
- [Related Workflow 2](../category/related-2.md)
- [Related Workflow 3](../category/related-3.md)

## Troubleshooting
- [Common issue 1 and solution]
- [Common issue 2 and solution]
- [Common issue 3 and solution]

## Change Log
- ${new Date().toISOString().split('T')[0]}: Initial version created
`;

      // Ensure directory exists
      await mkdir(join('./workflows', category), { recursive: true });
      
      // Write the file
      await writeFile(filepath, template);
      
      return {
        success: true,
        message: `Workflow template created successfully!`,
        path: filepath,
        nextSteps: [
          "1. Edit the template to add specific steps",
          "2. Test the workflow in Claude",
          "3. Update success metrics with real data",
          "4. Add actual sample output",
          "5. Link related workflows"
        ]
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        help: "Check that the workflows directory exists and you have write permissions"
      };
    }
  }
};
