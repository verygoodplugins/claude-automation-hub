// Example MCP tool for generating workflow templates
export default {
  name: "generate_workflow_template",
  description: "Generate a new workflow template based on category and requirements",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        enum: ["daily", "weekly", "monthly", "on-demand"],
        description: "Workflow category"
      },
      name: {
        type: "string",
        description: "Workflow name (kebab-case)"
      },
      description: {
        type: "string",
        description: "Brief description of what the workflow does"
      },
      integrations: {
        type: "array",
        items: { type: "string" },
        description: "Required MCP integrations (e.g., freescout, postgres, etc.)"
      },
      timeEstimate: {
        type: "string",
        description: "Estimated time saved per run (e.g., '30 minutes')"
      }
    },
    required: ["category", "name", "description"]
  },
  handler: async ({ category, name, description, integrations = [], timeEstimate = "Unknown" }) => {
    const template = `# ${name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')}

## Description
${description}

## Time Saved
${timeEstimate}

## Required Integrations
${integrations.length > 0 ? integrations.map(i => `- ${i}`).join('\n') : '- None specified'}

## Workflow Steps

1. **Initialize**
   \`\`\`
   // Add your initialization steps here
   \`\`\`

2. **Main Process**
   \`\`\`
   // Add your main workflow logic here
   \`\`\`

3. **Cleanup/Report**
   \`\`\`
   // Add cleanup or reporting steps here
   \`\`\`

## Usage Notes
- Run frequency: ${category}
- Best time to run: [Specify when this workflow should be executed]
- Prerequisites: [Any setup required before running]

## Example Output
\`\`\`
[Provide example of what this workflow produces]
\`\`\`

---
*Generated on ${new Date().toISOString()}*
`;

    return {
      template,
      filename: `workflows/${category}/${name}.md`,
      message: `Generated workflow template for '${name}' in category '${category}'`
    };
  }
};
