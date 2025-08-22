# Discussion Templates

These templates help structure community discussions in the Claude Automation Hub. They automatically appear when users create new discussions in their respective categories.

## Available Templates

### 📣 Announcements
For official updates from maintainers about new releases, features, or important changes.

### 💡 Ideas  
Share suggestions for new features, workflows, or improvements to the automation hub.

### 🙏 Q&A
Ask the community questions about setup, workflows, best practices, or troubleshooting.

### 📚 Resources & Tutorials
Share helpful guides, tutorials, workflow templates, or educational content with the community.

### 🙌 Show and Tell
Showcase your automations, custom workflows, and success stories with time savings metrics.

### 🐛 Troubleshooting
Report issues and get help solving problems with detailed environment information and error logs.

## How Templates Work

1. When creating a new discussion, users select a category
2. The corresponding template loads automatically
3. Users fill out the structured form fields
4. The discussion is created with consistent formatting

## Benefits

- **Consistency**: All discussions in a category follow the same structure
- **Completeness**: Required fields ensure important information isn't missed  
- **Discoverability**: Structured data makes discussions easier to search and reference
- **Quality**: Guided questions lead to more helpful and actionable discussions

## Customizing Templates

Templates are defined in YAML format in this directory. To modify a template:

1. Edit the corresponding `.yml` file
2. Commit and push changes
3. Templates update immediately for new discussions

Each template uses [GitHub's form schema syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema).

## Template Structure

```yaml
title: "[Category] "          # Prefix for discussion titles
labels: ["label1", "label2"]  # Auto-applied labels
body:                         # Form fields
  - type: markdown           # Instructions/headers
  - type: input              # Single-line text
  - type: textarea           # Multi-line text  
  - type: dropdown           # Select from options
  - type: checkboxes         # Multiple selections
```

## Contributing

To suggest improvements to templates, please:
1. Open a discussion in the Ideas category
2. Describe the proposed change and rationale
3. Include example of how it would look