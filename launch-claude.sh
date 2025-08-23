#!/bin/bash
# Script to launch Claude Desktop with environment variables loaded

# Load environment variables from .env file
set -a
source "$(dirname "$0")/.env"
set +a

# Launch Claude Desktop
open -a "Claude"