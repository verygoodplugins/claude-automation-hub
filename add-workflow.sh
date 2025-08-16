#!/bin/bash

# Add New Workflow Script
# Usage: ./add-workflow.sh daily "workflow-name" "Description of what it does"

CATEGORY=$1
WORKFLOW_NAME=$2
DESCRIPTION=$3

if [ -z "$CATEGORY" ] || [ -z "$WORKFLOW_NAME" ]; then
    echo "Usage: ./add-workflow.sh <category> <workflow-name> [description]"
    echo "Categories: daily, weekly, monthly, on-demand"
    exit 1
fi

# Create directory if it doesn't exist
mkdir -p workflows/$CATEGORY

# Create workflow file
FILENAME="workflows/$CATEGORY/$WORKFLOW_NAME.md"
DATE=$(date +%Y-%m-%d)

cat > $FILENAME << EOF
# $WORKFLOW_NAME

## Description
$DESCRIPTION

## Command
\`\`\`
[Paste your tested Claude command here]
\`\`\`

## Prerequisites
- [ ] MCP Tool 1
- [ ] MCP Tool 2

## Frequency
[How often to run this]

## Time Saved
- Manual process: X minutes
- With automation: Y minutes
- **Saved: Z minutes**

## Variables
- \`PARAM_1\`: "default value"
- \`PARAM_2\`: "default value"

## Success Metrics
- [ ] Metric 1
- [ ] Metric 2

## Related Workflows
- [Link to related workflow](../category/workflow.md)

## Change Log
- $DATE: Created initial version

## Notes
[Any additional notes or tips]
EOF

echo "✅ Created $FILENAME"
echo "📝 Next steps:"
echo "   1. Edit $FILENAME with your workflow details"
echo "   2. Test the workflow in Claude"
echo "   3. Commit: git add $FILENAME && git commit -m 'Add: $WORKFLOW_NAME workflow'"
