# Changelog

All notable changes to the Claude Automation Hub will be documented in this file.

> **⚠️ Note:** Claude, Cursor, and MCP configurations evolve rapidly. We'll do our best to keep this updated with the latest patterns and best practices. If you notice something outdated, please open an issue!

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-08-24

### 🤖 Major Feature: Intelligent Agent System

#### Added
- **5 Specialized Agents** with automatic maintenance capabilities:
  - `doc-conflict-resolver` - Resolves documentation conflicts automatically
  - `session-cleanup` - Cleans temporary files and maintains repository hygiene
  - `project-memory-keeper` - Captures project decisions and patterns
  - `session-memory-capturer` - Records session learnings and discoveries
  - `config-synchronizer` - Keeps example configs in sync with implementation
- **Memory Integration** with OpenMemory MCP for persistent knowledge base
- **Parallel Agent Execution** with shared context for 50% performance improvement
- **Agent Coordination System** with resource sharing and conflict avoidance
- **Agent Attribution** - All agent-generated memories tagged for transparency
- `.claude/` directory structure for Claude Code configuration
- Agent reports system in `.claude/reports/`
- Memory attribution guidelines in `.claude/MEMORY-ATTRIBUTION.md`

#### Fixed
- All agent configurations updated with correct MCP tool names
- Agent tool references fixed (was using non-existent tool names)
- Documentation conflicts between MCP setup guides resolved

#### Improved
- README updated with comprehensive feature list and agent documentation
- Project structure documentation updated to reflect new directories
- Agent optimization for parallel execution and resource sharing

### Changed
- Reorganized project structure (docs/, scripts/, src/proxy/)
- Updated all documentation to use orange hearts 🧡 (WP Fusion branding)
- Copyright year updated to 2025
- Cleaned up sensitive data and personal paths for public release

## [1.0.0] - 2025-08-22

### 🎉 Initial Public Release
First public release of the Claude Automation Hub, featuring battle-tested workflows from Very Good Plugins.

### Added
- **Core Features**
  - 20+ pre-built workflows saving 60+ hours/month
  - Hot-reloadable MCP tools with `mcp-reloader`
  - Automated workflow scheduling system
  - Quick Start guide (15-minute setup)

- **Workflows**
  - Daily: Morning routine, End-of-day shutdown, Support triage
  - Weekly: Review & planning, Mastermind prep
  - Monthly: Business review, Tax compliance
  - On-demand: Focus mode, Project initialization, Deep work, Customer research

- **MCP Integrations** (15+ servers)
  - Productivity: Gmail, Calendar, Apple ecosystem, Filesystem
  - Communication: Slack, WhatsApp, FreeScout
  - Development: GitHub, PostgreSQL, Browser automation
  - Business: Stripe, Google Drive, WordPress

- **Advanced Features**
  - Clickable links with Cursor IDE integration
  - Mobile notifications via NTFY
  - Smart notification bundling
  - Dashboard and analytics tracking

### Configuration Updates
- Claude Desktop config examples for all MCPs
- Cursor IDE integration settings
- Environment variable templates
- Security policies and best practices

## [0.9.0] - 2025-08-21

### Added
- **Clickable Links Feature** - Web proxy to bypass Claude Desktop sandboxing
- **Network Binding Options** - Advanced configuration for proxy access
- **Executive Assistant Workflows** - Enhanced prompts with Research Mode

### Changed
- Switched from Extended Thinking to Research Mode for complex workflows
- Enhanced tool enforcement in executive assistant prompts
- Improved security documentation

### Fixed
- Template literal syntax errors in setup scripts
- Auto-start functionality for proxy server

## [0.8.0] - 2025-08-20

### Added
- **Cursor CLI Integration** - Deep linking between Claude and code editor
- **Comprehensive Security Guide** - SECURITY.md with best practices
- **Environment Variable Support** - .env.example template
- **Testing Infrastructure** - Complete test suite for all components

### Changed
- Updated testing guide for Cursor CLI integration
- Documented hot-reload setup process
- Enhanced MCP tool capabilities

## [0.7.0] - 2025-08-19

### Added
- **Mobile MCP Foundations** - NTFY integration for push notifications
- **Smart Notification Bundling** - Prevents notification overload
- **Context Bridge** - Preparation for mobile AI assistants
- **Automated Scheduling** - Time-based workflow triggers

### Changed
- Merged mobile-mcp-foundations feature branch
- Updated workflow examples with mobile notifications

## [0.5.0] - 2025-08-18

### Added
- **NTFY Mobile Notifications** - Push workflow results to phone
- **Workflow Generator** - Dynamic workflow creation tools
- **Hub Statistics** - Analytics and ROI tracking
- **Additional Workflows** - Customer communication, partnership prep

## [0.1.0] - 2025-08-16

### Added
- **Initial Commit** - Claude Automation Hub foundation
- **Core Workflows** - 9 high-impact automation workflows
- **FreeScout Integration** - Support ticket automation
- **Stripe Integration** - Payment and subscription tracking
- **Testing Guide** - Comprehensive testing documentation
- **MCP Reloader** - Hot-reload capability for custom tools

---

## Configuration Evolution Notes

### Latest Configuration Patterns (2025-08-22)
- **Permissions**: Auto-approved tools in `.claude/settings.json`
- **MCP Servers**: Example configs in `config/` directory
- **Environment Variables**: Standardized in `.env.example`
- **Workspace Settings**: VS Code workspace configuration

### How to Stay Updated
1. Watch this repository for updates
2. Check the [config/](config/) directory for latest examples
3. Review recent commits for configuration changes
4. Join our [weekly AI automation series](https://wpfusion.com/blog/?utm_source=github&utm_medium=changelog&utm_campaign=ai-automation-hub)

### Contributing
Found an outdated configuration? Please:
1. Open an issue describing the change
2. Submit a PR with updated examples
3. Tag it with `config-update` label

---

*Built with 🧡 by [Very Good Plugins](https://verygoodplugins.com) for the open source community*