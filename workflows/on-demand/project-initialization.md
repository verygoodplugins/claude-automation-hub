# Project Initialization

## Command
```
Initialize a new project with complete setup:
1. Create project directory structure using Filesystem
2. Initialize Git repository and create initial commit
3. Set up Git worktree for feature development
4. Get relevant framework documentation from Context7
5. Generate README, LICENSE, and .gitignore files
6. Create initial project documentation structure
7. Set up project tasks and milestones in Apple Reminders
8. Store project configuration in OpenMemory
9. Create calendar blocks for initial development sprints
10. Send project kickoff notification via WhatsApp
11. Open project in Brave with relevant documentation tabs
```

## Prerequisites
- Filesystem MCP (for directory structure)
- Git Integration MCP (for version control)
- Context7 MCP (for documentation)
- Apple Reminders MCP (for task management)
- OpenMemory MCP (for project config)
- Google Calendar MCP (for sprint planning)
- WhatsApp MCP (for team notification)
- Brave Browser MCP (for resources)

## Frequency
On-demand (when starting new projects)

## Time Saved
- Manual setup: 60-90 minutes
- With automation: 5 minutes
- **Saved: 55-85 minutes per project**

## Variables You Can Customize
- `PROJECT_NAME`: "my-awesome-project"
- `PROJECT_TYPE`: "web" | "api" | "mobile" | "library" | "cli"
- `LANGUAGE`: "javascript" | "typescript" | "python" | "go"
- `FRAMEWORK`: "react" | "vue" | "express" | "fastapi" | "nextjs"
- `LICENSE_TYPE`: "MIT" | "Apache-2.0" | "GPL-3.0" | "Proprietary"
- `INCLUDE_TESTS`: true
- `INCLUDE_CI`: true
- `TEAM_SIZE`: 1 // for collaboration setup
- `SPRINT_LENGTH`: 14 // days

## Success Metrics
- ✅ Project structure created
- ✅ Version control initialized
- ✅ Documentation prepared
- ✅ Tasks organized
- ✅ Team notified
- ✅ Ready to code

## Sample Output Format
```
🚀 PROJECT INITIALIZATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJECT STRUCTURE CREATED
Path: /Users/jgarturo/Projects/customer-portal

customer-portal/
├── 📄 README.md (generated)
├── 📄 LICENSE (MIT)
├── 📄 .gitignore (Node.js + React)
├── 📄 .env.example
├── 📄 package.json
├── 📄 tsconfig.json
├── 📁 src/
│   ├── 📁 components/
│   │   └── 📄 .gitkeep
│   ├── 📁 pages/
│   │   └── 📄 index.tsx
│   ├── 📁 styles/
│   │   └── 📄 globals.css
│   ├── 📁 utils/
│   │   └── 📄 .gitkeep
│   ├── 📁 hooks/
│   │   └── 📄 .gitkeep
│   ├── 📁 services/
│   │   └── 📄 api.ts
│   └── 📄 App.tsx
├── 📁 public/
│   └── 📄 index.html
├── 📁 tests/
│   ├── 📁 unit/
│   │   └── 📄 App.test.tsx
│   └── 📁 integration/
│       └── 📄 .gitkeep
├── 📁 docs/
│   ├── 📄 API.md
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 CONTRIBUTING.md
│   └── 📄 DEPLOYMENT.md
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 ci.yml
└── 📁 scripts/
    ├── 📄 setup.sh
    └── 📄 deploy.sh

✅ Files Created: 25
✅ Directories Created: 15

🔧 GIT REPOSITORY INITIALIZED
• Initial commit: "🎉 Initial project setup"
• Branch: main
• Remote: Not configured (run 'git remote add origin <url>')
• .gitignore: 127 patterns for Node.js/React

🌳 GIT WORKTREE CREATED
• Feature branch: feature/initial-setup
• Location: ../customer-portal-worktrees/initial-setup/
• Ready for development

📚 DOCUMENTATION RETRIEVED (Context7)
Framework: Next.js v14
• App Router documentation ✓
• Server Components guide ✓
• API Routes reference ✓
• Deployment best practices ✓
• Performance optimization ✓

📝 README.md GENERATED
Sections included:
• Project description
• Installation instructions
• Development setup
• Architecture overview
• API documentation
• Testing guide
• Deployment process
• Contributing guidelines
• License information

✅ PROJECT TASKS CREATED (Apple Reminders)
━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Sprint 1 (Next 2 weeks):
□ Set up development environment
□ Configure authentication
□ Create base components
□ Implement routing
□ Set up state management
□ Create API service layer
□ Write initial tests
□ Set up CI/CD pipeline

🎯 Sprint 2 (Weeks 3-4):
□ Build user dashboard
□ Implement data fetching
□ Add error handling
□ Create loading states
□ Build notification system
□ Add analytics
□ Performance optimization
□ Security audit

📌 Milestones:
• Week 2: MVP functional
• Week 4: Beta release
• Week 6: Production ready
• Week 8: First deployment

💾 PROJECT CONFIG STORED (OpenMemory)
• Project type: Web Application
• Stack: TypeScript, React, Next.js
• Database: PostgreSQL
• Auth: NextAuth.js
• Styling: Tailwind CSS
• Testing: Jest + React Testing Library
• CI/CD: GitHub Actions
• Deployment: Vercel

📅 CALENDAR BLOCKS CREATED
• Mon/Wed/Fri 9-11 AM: Deep work (2 weeks)
• Tue/Thu 2-4 PM: Development (2 weeks)
• Friday 4 PM: Sprint review
• Monday 10 AM: Sprint planning

💬 TEAM NOTIFIED (WhatsApp)
Sent to: Development Team
"🚀 New Project Initialized: Customer Portal
Stack: Next.js + TypeScript
Sprint 1 starts tomorrow
Docs: /Projects/customer-portal/docs/
First sync: Monday 10 AM"

🌐 BROWSER WORKSPACE READY
Tabs opened:
1. Next.js Documentation
2. React TypeScript Guide
3. GitHub Repository (ready to create)
4. Vercel Dashboard
5. Project README (local)
6. Tailwind CSS Docs

🔨 QUICK START COMMANDS
```bash
cd /Users/jgarturo/Projects/customer-portal
npm install
npm run dev
# Open http://localhost:3000
```

🎨 VS CODE WORKSPACE
• Workspace file created
• Recommended extensions listed
• Debug configuration added
• Settings optimized for project

━━━━━━━━━━━━━━━━━━━━━━━━
🎯 NEXT ACTIONS:
1. Run 'npm install' to install dependencies
2. Configure environment variables
3. Set up database connection
4. Push to GitHub repository
5. Start coding! 🚀

💡 Project ready for development!
```

## Related Workflows
- [Git Workflow Setup](./git-workflow.md)
- [Development Environment](./dev-environment.md)
- [Code Documentation](./code-documentation.md)

## Troubleshooting
- Ensure you have write permissions in the target directory
- Git must be installed for repository initialization
- Some frameworks may require additional setup steps
- Large projects may need chunked file creation
