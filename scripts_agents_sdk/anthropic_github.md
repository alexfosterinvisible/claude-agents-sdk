---
title: "GitHub - anthropics/claude-agent-sdk-python"
source_url: "https://github.com/anthropics/claude-agent-sdk-python"
word_count: 4819
reading_time: "25 min read"
date_converted: "2025-10-16T01:48:45.169Z"
---

# GitHub - anthropics/claude-agent-sdk-python

GitHub - anthropics/claude-agent-sdk-python

===============

# Python SDK for Claude Agent. See the [Claude Agent SDK documentation](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-python) for more information.

## Installation

[](https://github.com/anthropics/claude-agent-sdk-python#installation)

undefinedshell
pip install claude-agent-sdk
undefined

**Prerequisites:**

- Python 3.10+
- Node.js
- Claude Code 2.0.0+: `npm install -g @anthropic-ai/claude-code`

## Quick Start

[](https://github.com/anthropics/claude-agent-sdk-python#quick-start)

undefinedpython
import anyio
from claude_agent_sdk import query

async def main():
async for message in query(prompt="What is 2 + 2?"):
print(message)

anyio.run(main)
undefined

## Basic Usage: query()

[](https://github.com/anthropics/claude-agent-sdk-python#basic-usage-query)

`query()` is an async function for querying Claude Code. It returns an `AsyncIterator` of response messages. See [src/claude_agent_sdk/query.py](https://github.com/anthropics/claude-agent-sdk-python/blob/main/src/claude_agent_sdk/query.py).

undefinedpython
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock

# Simple query

async for message in query(prompt="Hello Claude"):
if isinstance(message, AssistantMessage):
for block in message.content:
if isinstance(block, TextBlock):
print(block.text)

# With options

options = ClaudeAgentOptions(
system_prompt="You are a helpful assistant",
max_turns=1
)

async for message in query(prompt="Tell me a joke", options=options):
print(message)
undefined

### Using Tools

[](https://github.com/anthropics/claude-agent-sdk-python#using-tools)

undefinedpython
options = ClaudeAgentOptions(
allowed_tools=["Read", "Write", "Bash"],
permission_mode='acceptEdits' # auto-accept file edits
)

async for message in query(
prompt="Create a hello.py file",
options=options
): # Process tool use and results
pass
undefined

### Working Directory

[](https://github.com/anthropics/claude-agent-sdk-python#working-directory)

undefinedpython
from pathlib import Path

options = ClaudeAgentOptions(
cwd="/path/to/project" # or Path("/path/to/project")
)
undefined

## ClaudeSDKClient

[](https://github.com/anthropics/claude-agent-sdk-python#claudesdkclient)

`ClaudeSDKClient` supports bidirectional, interactive conversations with Claude Code. See [src/claude_agent_sdk/client.py](https://github.com/anthropics/claude-agent-sdk-python/blob/main/src/claude_agent_sdk/client.py).

Unlike `query()`, `ClaudeSDKClient` additionally enables **custom tools** and **hooks**, both of which can be defined as Python functions.

### Custom Tools (as In-Process SDK MCP Servers)

[](https://github.com/anthropics/claude-agent-sdk-python#custom-tools-as-in-process-sdk-mcp-servers)

A **custom tool** is a Python function that you can offer to Claude, for Claude to invoke as needed.

Custom tools are implemented in-process MCP servers that run directly within your Python application, eliminating the need for separate processes that regular MCP servers require.

For an end-to-end example, see [MCP Calculator](https://github.com/anthropics/claude-agent-sdk-python/blob/main/examples/mcp_calculator.py).

#### Creating a Simple Tool

[](https://github.com/anthropics/claude-agent-sdk-python#creating-a-simple-tool)

undefinedpython
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, ClaudeSDKClient

# Define a tool using the @tool decorator

@tool("greet", "Greet a user", {"name": str})
async def greet_user(args):
return {
"content": [
{"type": "text", "text": f"Hello, {args['name']}!"}
]
}

# Create an SDK MCP server

server = create_sdk_mcp_server(
name="my-tools",
version="1.0.0",
tools=[greet_user]
)

# Use it with Claude

options = ClaudeAgentOptions(
mcp_servers={"tools": server},
allowed_tools=["mcp__tools__greet"]
)

async with ClaudeSDKClient(options=options) as client:
await client.query("Greet Alice")

    # Extract and print response
    async for msg in client.receive_response():
        print(msg)

undefined

#### Benefits Over External MCP Servers

[](https://github.com/anthropics/claude-agent-sdk-python#benefits-over-external-mcp-servers)

- **No subprocess management** - Runs in the same process as your application
- **Better performance** - No IPC overhead for tool calls
- **Simpler deployment** - Single Python process instead of multiple
- **Easier debugging** - All code runs in the same process
- **Type safety** - Direct Python function calls with type hints

#### Migration from External Servers

[](https://github.com/anthropics/claude-agent-sdk-python#migration-from-external-servers)

undefinedpython

# BEFORE: External MCP server (separate process)

options = ClaudeAgentOptions(
mcp_servers={
"calculator": {
"type": "stdio",
"command": "python",
"args": ["-m", "calculator_server"]
}
}
)

# AFTER: SDK MCP server (in-process)

from my_tools import add, subtract # Your tool functions

calculator = create_sdk_mcp_server(
name="calculator",
tools=[add, subtract]
)

options = ClaudeAgentOptions(
mcp_servers={"calculator": calculator}
)
undefined

#### Mixed Server Support

[](https://github.com/anthropics/claude-agent-sdk-python#mixed-server-support)

You can use both SDK and external MCP servers together:

undefinedpython
options = ClaudeAgentOptions(
mcp_servers={
"internal": sdk_server, # In-process SDK server
"external": { # External subprocess server
"type": "stdio",
"command": "external-server"
}
}
)
undefined

### Hooks

[](https://github.com/anthropics/claude-agent-sdk-python#hooks)

A **hook** is a Python function that the Claude Code _application_ (_not_ Claude) invokes at specific points of the Claude agent loop. Hooks can provide deterministic processing and automated feedback for Claude. Read more in [Claude Code Hooks Reference](https://docs.anthropic.com/en/docs/claude-code/hooks).

For more examples, see examples/hooks.py.

#### Example

[](https://github.com/anthropics/claude-agent-sdk-python#example)

undefinedpython
from claude_agent_sdk import ClaudeAgentOptions, ClaudeSDKClient, HookMatcher

async def check_bash_command(input_data, tool_use_id, context):
tool_name = input_data["tool_name"]
tool_input = input_data["tool_input"]
if tool_name != "Bash":
return {}
command = tool_input.get("command", "")
block_patterns = ["foo.sh"]
for pattern in block_patterns:
if pattern in command:
return {
"hookSpecificOutput": {
"hookEventName": "PreToolUse",
"permissionDecision": "deny",
"permissionDecisionReason": f"Command contains invalid pattern: {pattern}",
}
}
return {}

options = ClaudeAgentOptions(
allowed_tools=["Bash"],
hooks={
"PreToolUse": [
HookMatcher(matcher="Bash", hooks=[check_bash_command]),
],
}
)

async with ClaudeSDKClient(options=options) as client: # Test 1: Command with forbidden pattern (will be blocked)
await client.query("Run the bash command: ./foo.sh --help")
async for msg in client.receive_response():
print(msg)

    print("\n" + "=" * 50 + "\n")

    # Test 2: Safe command that should work
    await client.query("Run the bash command: echo 'Hello from hooks example!'")
    async for msg in client.receive_response():
        print(msg)

undefined

## Types

[](https://github.com/anthropics/claude-agent-sdk-python#types)

See [src/claude_agent_sdk/types.py](https://github.com/anthropics/claude-agent-sdk-python/blob/main/src/claude_agent_sdk/types.py) for complete type definitions:

- `ClaudeAgentOptions` - Configuration options
- `AssistantMessage`, `UserMessage`, `SystemMessage`, `ResultMessage` - Message types
- `TextBlock`, `ToolUseBlock`, `ToolResultBlock` - Content blocks

## Error Handling

[](https://github.com/anthropics/claude-agent-sdk-python#error-handling)

undefinedpython
from claude_agent_sdk import (
ClaudeSDKError, # Base error
CLINotFoundError, # Claude Code not installed
CLIConnectionError, # Connection issues
ProcessError, # Process failed
CLIJSONDecodeError, # JSON parsing issues
)

try:
async for message in query(prompt="Hello"):
pass
except CLINotFoundError:
print("Please install Claude Code")
except ProcessError as e:
print(f"Process failed with exit code: {e.exit_code}")
except CLIJSONDecodeError as e:
print(f"Failed to parse response: {e}")
undefined

See [src/claude_agent_sdk/\_errors.py](https://github.com/anthropics/claude-agent-sdk-python/blob/main/src/claude_agent_sdk/_errors.py) for all error types.

## Available Tools

[](https://github.com/anthropics/claude-agent-sdk-python#available-tools)

See the [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code/settings#tools-available-to-claude) for a complete list of available tools.

## Examples

[](https://github.com/anthropics/claude-agent-sdk-python#examples)

See [examples/quick_start.py](https://github.com/anthropics/claude-agent-sdk-python/blob/main/examples/quick_start.py) for a complete working example.

See [examples/streaming_mode.py](https://github.com/anthropics/claude-agent-sdk-python/blob/main/examples/streaming_mode.py) for comprehensive examples involving `ClaudeSDKClient`. You can even run interactive examples in IPython from [examples/streaming_mode_ipython.py](https://github.com/anthropics/claude-agent-sdk-python/blob/main/examples/streaming_mode_ipython.py).

## Migrating from Claude Code SDK

[](https://github.com/anthropics/claude-agent-sdk-python#migrating-from-claude-code-sdk)

If you're upgrading from the Claude Code SDK (versions < 0.1.0), please see the [CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md#010) for details on breaking changes and new features, including:

- `ClaudeCodeOptions` → `ClaudeAgentOptions` rename
- Merged system prompt configuration
- Settings isolation and explicit control
- New programmatic subagents and session forking features

## Development

[](https://github.com/anthropics/claude-agent-sdk-python#development)

If you're contributing to this project, run the initial setup script to install git hooks:

undefinedshell
./scripts/initial-setup.sh
undefined

This installs a pre-push hook that runs lint checks before pushing, matching the CI workflow. To skip the hook temporarily, use `git push --no-verify`.

## License

[](https://github.com/anthropics/claude-agent-sdk-python#license)

MIT

## About

No description, website, or topics provided.
