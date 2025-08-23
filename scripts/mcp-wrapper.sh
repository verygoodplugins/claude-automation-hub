#!/bin/bash
# Wrapper script to load .env before running MCP servers

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load environment variables from .env file
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
fi

# For the VGP WordPress server instance, use VGP credentials
if [ "$WORDPRESS_API_URL" = "https://verygoodplugins.com" ]; then
    export WORDPRESS_USERNAME="${VGP_USERNAME}"
    export WORDPRESS_PASSWORD="${VGP_PASSWORD}"
fi

# Execute the passed command with all arguments
exec "$@"