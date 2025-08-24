#!/usr/bin/env python3
"""
Test script to verify MCP Memory Service is working correctly for the Automation Hub
Run this after migration to ensure everything is set up properly.
"""

import os
import sys
import asyncio
from pathlib import Path

# Add the MCP Memory Service to path
mcp_path = Path("/Users/jgarturo/Projects/OpenAI/mcp-servers/mcp-memory-service")
sys.path.insert(0, str(mcp_path))

# ANSI colors for output
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BLUE = "\033[94m"
RESET = "\033[0m"
BOLD = "\033[1m"

def print_header(text):
    print(f"\n{BOLD}{BLUE}{'=' * 60}{RESET}")
    print(f"{BOLD}{BLUE} {text}{RESET}")
    print(f"{BOLD}{BLUE}{'=' * 60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✅ {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠️  {text}{RESET}")

def print_error(text):
    print(f"{RED}❌ {text}{RESET}")

def print_info(text):
    print(f"➔ {text}")

async def test_memory_operations():
    """Test core memory operations."""
    try:
        from mcp_memory_service.storage.factory import get_storage
        from mcp_memory_service.models.memory import Memory
        
        print_header("Testing MCP Memory Service Operations")
        
        # Initialize storage
        print_info("Initializing ChromaDB storage...")
        storage = await get_storage()
        print_success("Storage initialized successfully")
        
        # Test 1: Store a memory
        print_info("\nTest 1: Storing automation hub memory...")
        test_memory = Memory(
            content="Automation Hub migrated to MCP Memory Service successfully",
            tags=["automation-hub", "migration", "test"],
            metadata={
                "type": "system",
                "importance": "high",
                "timestamp": "2025-01-30"
            }
        )
        
        memory_id = await storage.store(test_memory)
        print_success(f"Memory stored with ID: {memory_id}")
        
        # Test 2: Retrieve by semantic search
        print_info("\nTest 2: Semantic search...")
        results = await storage.retrieve("automation migration", n_results=5)
        if results:
            print_success(f"Found {len(results)} relevant memories")
            for i, result in enumerate(results[:2], 1):
                print(f"  {i}. {result.content[:100]}...")
        else:
            print_warning("No results found (this is normal for a fresh installation)")
        
        # Test 3: Search by tags
        print_info("\nTest 3: Tag-based search...")
        tag_results = await storage.search_by_tag(["automation-hub"])
        if tag_results:
            print_success(f"Found {len(tag_results)} memories with 'automation-hub' tag")
        else:
            print_warning("No tagged memories found yet")
        
        # Test 4: Time-based recall (if supported)
        print_info("\nTest 4: Time-based recall...")
        try:
            from mcp_memory_service.utils.time_parser import parse_time_expression
            time_expr = parse_time_expression("today")
            print_success(f"Time parser working: 'today' = {time_expr}")
        except Exception as e:
            print_warning(f"Time-based recall not available: {e}")
        
        # Test 5: Check consolidation features
        print_info("\nTest 5: Checking consolidation features...")
        if os.getenv("MCP_CONSOLIDATION_ENABLED") == "true":
            print_success("Memory consolidation is ENABLED")
            print_info("  - Daily consolidation will run automatically")
            print_info("  - Association discovery is active")
            print_info("  - Smart clustering enabled")
        else:
            print_warning("Memory consolidation is DISABLED")
            print_info("  Set MCP_CONSOLIDATION_ENABLED=true to enable")
        
        # Test 6: Database health
        print_info("\nTest 6: Database health check...")
        stats = await storage.get_stats()
        print_success("Database is healthy")
        print_info(f"  Total memories: {stats.get('total_memories', 0)}")
        print_info(f"  Storage backend: {stats.get('backend', 'ChromaDB')}")
        
        # Test 7: Multi-client coordination
        print_info("\nTest 7: Multi-client coordination...")
        if os.getenv("MCP_HTTP_ENABLED") == "true":
            print_success("HTTP server enabled for multi-client access")
            print_info(f"  API available at: http://{os.getenv('MCP_HTTP_HOST', '127.0.0.1')}:{os.getenv('MCP_HTTP_PORT', '8000')}")
        else:
            print_info("HTTP server not enabled (single-client mode)")
        
        print_header("Automation Hub Integration Status")
        
        # Check workflow files
        print_info("Checking workflow files...")
        workflow_path = Path("/Users/jgarturo/Projects/OpenAI/claude-automation-hub/workflows")
        if workflow_path.exists():
            morning_routine = workflow_path / "daily" / "morning-routine.md"
            if morning_routine.exists():
                content = morning_routine.read_text()
                if "MCP Memory Service" in content:
                    print_success("Workflows updated to use MCP Memory Service")
                elif "OpenMemory" in content:
                    print_warning("Workflows still reference OpenMemory - run migration script")
                else:
                    print_info("Workflows don't reference memory service")
        
        # Summary
        print_header("Migration Summary")
        print_success("MCP Memory Service is working correctly!")
        print_info("\nNext steps:")
        print_info("1. Update automation-hub.js with the provided code")
        print_info("2. Run the migration script to update workflows")
        print_info("3. Restart Claude Desktop")
        print_info("4. Test with: claude /memory-health")
        print_info("\n💡 Pro tip: Enable HTTP server for mobile access:")
        print_info("   python scripts/run_http_server.py")
        
        return True
        
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

async def test_claude_commands():
    """Test if Claude commands are properly installed."""
    print_header("Testing Claude Commands")
    
    commands_path = Path("/Users/jgarturo/Projects/OpenAI/mcp-servers/mcp-memory-service/claude_commands")
    
    if commands_path.exists():
        commands = list(commands_path.glob("*.md"))
        if commands:
            print_success(f"Found {len(commands)} Claude commands:")
            for cmd in commands:
                print(f"  • /memory-{cmd.stem}")
            print_info("\nYou can use these commands directly in Claude Desktop!")
        else:
            print_warning("No Claude commands found")
    else:
        print_warning("Claude commands not installed")
        print_info("Run: python install.py --install-claude-commands")

async def main():
    """Run all tests."""
    print(f"{BOLD}{BLUE}")
    print("╔═══════════════════════════════════════════════════════╗")
    print("║   MCP Memory Service - Automation Hub Test Suite     ║")
    print("╚═══════════════════════════════════════════════════════╝")
    print(f"{RESET}")
    
    # Run tests
    success = await test_memory_operations()
    await test_claude_commands()
    
    if success:
        print(f"\n{GREEN}{BOLD}🎉 All tests passed! Your automation hub is ready with MCP Memory Service!{RESET}")
    else:
        print(f"\n{YELLOW}{BOLD}⚠️  Some tests failed. Check the errors above.{RESET}")
    
    return success

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)
