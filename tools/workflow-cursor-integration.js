export default {
  name: "workflow_cursor_integration",
  description: "Integrate Cursor CLI with automation workflows - open files, run analysis, and execute development tasks",
  inputSchema: {
    type: "object",
    properties: {
      workflow: {
        type: "string",
        enum: [
          "debug_workflow", 
          "review_code", 
          "analyze_project", 
          "fix_issue",
          "create_documentation",
          "refactor_code"
        ],
        description: "Pre-built workflow to execute"
      },
      filePath: {
        type: "string",
        description: "Target file path (relative to project root)"
      },
      lineNumber: {
        type: "number",
        description: "Specific line to focus on"
      },
      issue: {
        type: "string", 
        description: "Description of issue or task"
      },
      context: {
        type: "string",
        description: "Additional context for the AI agent"
      }
    },
    required: ["workflow"]
  },
  handler: async ({ workflow, filePath, lineNumber, issue, context }) => {
    const projectRoot = process.env.CURSOR_DEFAULT_PROJECT || process.cwd();
    const workflows = {
      debug_workflow: {
        name: "Debug Workflow",
        steps: [
          {
            action: "open_file",
            description: "Open file in Cursor at specific line",
            command: filePath ? `cursor "${projectRoot}/${filePath}${lineNumber ? `:${lineNumber}:1` : ''}"` : `cursor "${projectRoot}"`
          },
          {
            action: "run_analysis", 
            description: "Run AI analysis on the issue",
            prompt: `Debug this ${filePath ? `file ${filePath}` : 'project'}${lineNumber ? ` at line ${lineNumber}` : ''}. Issue: ${issue || 'General debugging'}. ${context ? `Context: ${context}` : ''} Please identify the problem and suggest fixes.`
          }
        ]
      },
      
      review_code: {
        name: "Code Review Workflow",
        steps: [
          {
            action: "open_file",
            description: "Open target file for review",
            command: filePath ? `cursor "${projectRoot}/${filePath}"` : `cursor "${projectRoot}"`
          },
          {
            action: "run_analysis",
            description: "Perform comprehensive code review",
            prompt: `Review this ${filePath ? `file: ${filePath}` : 'project'}. Look for: 1) Code quality issues, 2) Security vulnerabilities, 3) Performance improvements, 4) Best practices violations. ${context ? `Additional context: ${context}` : ''}`
          }
        ]
      },

      analyze_project: {
        name: "Project Analysis Workflow", 
        steps: [
          {
            action: "open_project",
            description: "Open entire project in Cursor",
            command: `cursor "${projectRoot}"`
          },
          {
            action: "run_analysis",
            description: "Analyze project structure and architecture",
            prompt: `Analyze this automation hub project. Provide insights on: 1) Architecture overview, 2) Key components and their relationships, 3) Potential improvements, 4) Missing features or tools. ${context ? `Focus on: ${context}` : ''}`
          }
        ]
      },

      fix_issue: {
        name: "Issue Fix Workflow",
        steps: [
          {
            action: "open_file", 
            description: "Open problematic file",
            command: filePath ? `cursor "${projectRoot}/${filePath}${lineNumber ? `:${lineNumber}:1` : ''}"` : `cursor "${projectRoot}"`
          },
          {
            action: "run_fix",
            description: "Generate fix for the issue",
            prompt: `Fix this issue: ${issue || 'Unspecified issue'}. ${filePath ? `File: ${filePath}` : ''} ${lineNumber ? `Line: ${lineNumber}` : ''} ${context ? `Context: ${context}` : ''} Provide a complete solution with code changes.`
          }
        ]
      },

      create_documentation: {
        name: "Documentation Creation Workflow",
        steps: [
          {
            action: "open_project",
            description: "Open project for documentation",
            command: `cursor "${projectRoot}"`
          },
          {
            action: "run_documentation",
            description: "Generate comprehensive documentation",
            prompt: `Create documentation for this ${filePath ? `file: ${filePath}` : 'automation hub project'}. Include: 1) Purpose and functionality, 2) Usage examples, 3) API/interface documentation, 4) Setup instructions. ${context ? `Focus: ${context}` : ''}`
          }
        ]
      },

      refactor_code: {
        name: "Code Refactoring Workflow",
        steps: [
          {
            action: "open_file",
            description: "Open file for refactoring", 
            command: filePath ? `cursor "${projectRoot}/${filePath}"` : `cursor "${projectRoot}"`
          },
          {
            action: "run_refactor",
            description: "Suggest refactoring improvements",
            prompt: `Refactor this ${filePath ? `file: ${filePath}` : 'project'}. Goals: 1) Improve code structure, 2) Enhance readability, 3) Optimize performance, 4) Follow best practices. ${issue ? `Specific focus: ${issue}` : ''} ${context ? `Context: ${context}` : ''}`
          }
        ]
      }
    };

    const selectedWorkflow = workflows[workflow];
    if (!selectedWorkflow) {
      return {
        success: false,
        error: `Unknown workflow: ${workflow}`,
        availableWorkflows: Object.keys(workflows)
      };
    }

    return {
      success: true,
      workflow: selectedWorkflow.name,
      projectRoot,
      steps: selectedWorkflow.steps,
      executionPlan: {
        description: `Ready to execute ${selectedWorkflow.name}`,
        instructions: [
          "1. Use the cursor_cli_deeplink tool to execute the 'open' commands",
          "2. Use cursor-agent CLI to run the analysis prompts", 
          "3. Review results and iterate as needed"
        ],
        commands: selectedWorkflow.steps.map((step, index) => ({
          step: index + 1,
          action: step.action,
          description: step.description,
          command: step.command || `cursor-agent -p "${step.prompt}"`,
          workingDir: projectRoot
        }))
      },
      metadata: {
        filePath,
        lineNumber,
        issue,
        context,
        timestamp: new Date().toISOString()
      }
    };
  }
};
