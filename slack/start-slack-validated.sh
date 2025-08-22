#!/bin/bash

# Slack Integration Validated Startup Script
# Runs setup validation before starting to prevent common issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Slack Integration Validated Startup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check for --force flag
FORCE_START=false
MONITOR_MODE=false
DEBUG_MODE=false
WITH_TUNNEL=false

for arg in "$@"; do
  case $arg in
    --force)
      FORCE_START=true
      echo -e "${YELLOW}⚠️  Force mode enabled - skipping validation${NC}"
      ;;
    --monitor)
      MONITOR_MODE=true
      echo -e "${CYAN}📊 Health monitoring will be enabled${NC}"
      ;;
    --debug)
      DEBUG_MODE=true
      echo -e "${CYAN}🔍 Debug mode enabled${NC}"
      export NODE_ENV=development
      export DEBUG_MODE=true
      ;;
    --with-tunnel)
      WITH_TUNNEL=true
      echo -e "${CYAN}🌐 Tunnel will be started${NC}"
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --force       Skip validation checks"
      echo "  --monitor     Enable health monitoring"
      echo "  --debug       Enable debug mode with verbose logging"
      echo "  --with-tunnel Start Cloudflare tunnel"
      echo "  --help        Show this help message"
      exit 0
      ;;
  esac
done

cd "$PROJECT_ROOT"

# Run validation unless --force is used
if [ "$FORCE_START" = false ]; then
  echo -e "${CYAN}🔍 Running setup validation...${NC}"
  echo ""
  
  # Check if setup wizard exists
  if [ ! -f "$SCRIPT_DIR/setup-wizard.js" ]; then
    echo -e "${RED}❌ Setup wizard not found!${NC}"
    echo -e "${YELLOW}Please ensure slack/setup-wizard.js exists${NC}"
    exit 1
  fi
  
  # Run quick validation (non-interactive mode)
  VALIDATION_OUTPUT=$(node "$SCRIPT_DIR/setup-wizard.js" --quick 2>&1 || true)
  
  # Check if validation passed
  if echo "$VALIDATION_OUTPUT" | grep -q "All checks passed"; then
    echo -e "${GREEN}✅ Validation passed!${NC}"
  else
    echo -e "${YELLOW}⚠️  Validation found issues:${NC}"
    echo "$VALIDATION_OUTPUT" | grep -E "❌|⚠️" || true
    echo ""
    echo -e "${YELLOW}Run the full setup wizard to fix issues:${NC}"
    echo -e "${CYAN}  node slack/setup-wizard.js${NC}"
    echo ""
    read -p "Continue anyway? (not recommended) [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${RED}Startup cancelled${NC}"
      exit 1
    fi
  fi
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}📦 Installing dependencies...${NC}"
  npm install
fi

# Kill any existing processes
echo -e "${CYAN}🛑 Stopping any existing services...${NC}"

# Stop server
SERVER_PID=$(lsof -ti :8765 2>/dev/null || true)
if [ ! -z "$SERVER_PID" ]; then
  kill $SERVER_PID 2>/dev/null || true
  echo "  Stopped server (PID: $SERVER_PID)"
  sleep 2
fi

# Stop debug monitor if running
DEBUG_PID=$(lsof -ti :8766 2>/dev/null || true)
if [ ! -z "$DEBUG_PID" ]; then
  kill $DEBUG_PID 2>/dev/null || true
  echo "  Stopped debug monitor (PID: $DEBUG_PID)"
fi

# Stop health monitor if running
MONITOR_PID=$(lsof -ti :8767 2>/dev/null || true)
if [ ! -z "$MONITOR_PID" ]; then
  kill $MONITOR_PID 2>/dev/null || true
  echo "  Stopped health monitor (PID: $MONITOR_PID)"
fi

echo ""

# Start services
echo -e "${GREEN}🚀 Starting services...${NC}"

# Start main server
echo -e "${CYAN}  Starting Slack server on port 8765...${NC}"
if [ "$DEBUG_MODE" = true ]; then
  node src/proxy/cursor-web-proxy.js 2>&1 | tee slack/debug/server.log &
else
  node src/proxy/cursor-web-proxy.js > /dev/null 2>&1 &
fi
SERVER_PID=$!
echo -e "${GREEN}  ✓ Server started (PID: $SERVER_PID)${NC}"

# Start debug monitor if in debug mode
if [ "$DEBUG_MODE" = true ]; then
  echo -e "${CYAN}  Starting debug monitor on port 8766...${NC}"
  node slack/debug/slack-event-monitor.js > /dev/null 2>&1 &
  DEBUG_MONITOR_PID=$!
  echo -e "${GREEN}  ✓ Debug monitor started (PID: $DEBUG_MONITOR_PID)${NC}"
fi

# Start health monitor if requested
if [ "$MONITOR_MODE" = true ]; then
  echo -e "${CYAN}  Starting health monitor on port 8767...${NC}"
  node slack/health-monitor.js > /dev/null 2>&1 &
  HEALTH_MONITOR_PID=$!
  echo -e "${GREEN}  ✓ Health monitor started (PID: $HEALTH_MONITOR_PID)${NC}"
fi

# Start tunnel if requested
if [ "$WITH_TUNNEL" = true ]; then
  echo -e "${CYAN}  Starting Cloudflare tunnel...${NC}"
  if [ -f "$PROJECT_ROOT/cloudflare-tunnel/start-tunnel.sh" ]; then
    "$PROJECT_ROOT/cloudflare-tunnel/start-tunnel.sh" > /dev/null 2>&1 &
    TUNNEL_PID=$!
    echo -e "${GREEN}  ✓ Tunnel started (PID: $TUNNEL_PID)${NC}"
  else
    echo -e "${YELLOW}  ⚠️ Tunnel script not found${NC}"
  fi
fi

# Wait for services to start
sleep 3

# Test server health
echo ""
echo -e "${CYAN}🧪 Testing server health...${NC}"
if curl -s http://localhost:8765/health > /dev/null 2>&1; then
  echo -e "${GREEN}  ✓ Server is healthy${NC}"
else
  echo -e "${RED}  ✗ Server health check failed${NC}"
fi

# Set up cleanup trap
cleanup() {
  echo ""
  echo -e "${YELLOW}Shutting down services...${NC}"
  
  [ ! -z "$SERVER_PID" ] && kill $SERVER_PID 2>/dev/null || true
  [ ! -z "$DEBUG_MONITOR_PID" ] && kill $DEBUG_MONITOR_PID 2>/dev/null || true
  [ ! -z "$HEALTH_MONITOR_PID" ] && kill $HEALTH_MONITOR_PID 2>/dev/null || true
  [ ! -z "$TUNNEL_PID" ] && kill $TUNNEL_PID 2>/dev/null || true
  
  echo -e "${GREEN}Services stopped${NC}"
  exit
}

trap cleanup INT TERM

# Display status
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Slack Integration Active${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}📍 Services:${NC}"
echo -e "  • Main server: ${GREEN}http://localhost:8765${NC}"

if [ "$DEBUG_MODE" = true ]; then
  echo -e "  • Debug monitor: ${GREEN}http://localhost:8766/status${NC}"
fi

if [ "$MONITOR_MODE" = true ]; then
  echo -e "  • Health monitor: ${GREEN}http://localhost:8767/status${NC}"
fi

if [ "$WITH_TUNNEL" = true ]; then
  echo ""
  echo -e "${CYAN}🌐 Public endpoints:${NC}"
  echo -e "  • ${GREEN}https://automation.verygoodplugins.com/slack/events${NC}"
  echo -e "  • ${GREEN}https://automation.verygoodplugins.com/slack/commands${NC}"
  echo -e "  • ${GREEN}https://automation.verygoodplugins.com/slack/interactive${NC}"
fi

if [ "$DEBUG_MODE" = true ]; then
  echo ""
  echo -e "${CYAN}📝 Debug logs:${NC}"
  echo -e "  • Server: slack/debug/server.log"
  echo -e "  • Events: slack/debug/slack-events.log"
  echo -e "  • Detailed: slack/debug/slack-events-detailed.json"
fi

echo ""
echo -e "${CYAN}💡 Tips:${NC}"
echo -e "  • Test slash commands in Slack: /auto-jack help"
echo -e "  • Check health: curl http://localhost:8765/health"

if [ "$MONITOR_MODE" = false ]; then
  echo -e "  • Enable monitoring: $0 --monitor"
fi

echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Keep script running
wait $SERVER_PID