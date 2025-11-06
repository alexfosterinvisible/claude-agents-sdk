# Claude Agent SDK Research Findings

Research conducted on TODO items from `cursor_process_explorer_cli.py` lines 346-368.

## TODO Research Items

### 1. Nice formatting for logs? REPORT ONLY, NO EDITS

**Question:** TODO - nice formatting for this? REPORT ONLY, NO EDITS

**Findings:**

For formatting Claude Agent SDK logs, you have several options:

- **Rich HTML export**: Use `rich.console.Console` with `record=True`, then call `console.export_html(theme="monokai", inline_styles=True)` to create beautifully formatted HTML logs with color tokens
- **Markdown with ANSI fences**: Wrap logs in markdown code blocks tagged with `ansi` for color preservation in viewers like GitHub
- **Langsmith Integration**: Use `langsmith.integrations.claude_agent_sdk.configure_claude_agent_sdk()` for structured tracing with better formatting and visualization
- **Custom formatters**: Create custom log processors that filter out verbose internal messages and highlight important tool uses and responses

---

### 2. Ask LLM to simplify whole conversation. REPORT ONLY, NO EDITS

**Question:** TODO - ask LLM to simplify whole conversation. REPORT ONLY, NO EDITS

**Findings:**

To simplify agent conversations, you can:

- Create a post-processing hook that extracts only `AssistantMessage` and `ToolUseBlock` content
- Use message filtering to capture only final outputs and critical tool uses
- Implement a custom summarization function that processes the full message stream and extracts key decisions and outcomes
- Use the `ResultMessage` at the end of conversations which contains summary information including total cost, tokens used, and stop reason

---

### 3. Did it create or edit any files? REPORT ONLY, NO EDITS

**Question:** TODO - did it create or edit any files? REPORT ONLY, NO EDITS

**Findings:**

To track file operations, monitor these specific tool uses:

- Look for `ToolUseBlock` instances where `block.name` is "Write", "Edit", "MultiEdit", or "Delete"
- Parse the `tool_input` field which contains file paths and content
- Create a PostToolUse hook that logs all file operations with their results
- Check `ToolResultBlock` content to verify if the file operation succeeded
- The SDK provides detailed tracking of all tool uses in the message stream

---

### 4. How to set default permissions? REPORT ONLY, NO EDITS

**Question:** TODO - how to set default permissions? REPORT ONLY, NO EDITS

**Findings:**

Setting default permissions in Claude Agent SDK uses the `ClaudeAgentOptions` class:

```python
options = ClaudeAgentOptions(
    permission_mode="default",  # Options: "default", "acceptEdits", "plan", "bypassPermissions"
    allowed_tools=["Read", "Write", "Bash", "Edit", "Glob", "Grep"],
    disallowed_tools=["Delete", "Run"],  # Explicitly block certain tools
    can_use_tool=custom_permission_callback,  # Dynamic permission control
)
```

Permission modes:
- `"default"`: Standard permissions, asks for confirmation
- `"acceptEdits"`: Auto-accepts file modifications
- `"plan"`: Planning mode only, no execution
- `"bypassPermissions"`: No restrictions (dangerous)

---

### 5. How to control scope and interrupt / terminate agent if it seems to be going off-piste? REPORT ONLY, NO EDITS

**Question:** TODO - how to control scope and interrupt / terminate agent if it seems to be going off-piste? REPORT ONLY, NO EDITS

**Findings:**

To control scope and interrupt agents:

**Scope Control:**
- Set `max_turns` limit to prevent runaway execution
- Use `max_budget_usd` to stop after spending limit
- Set `max_thinking_tokens` to limit reasoning
- Configure specific `allowed_tools` and `disallowed_tools`
- Use PreToolUse hooks to validate and block dangerous operations

**Interruption:**
```python
# Interrupt running agent
await client.interrupt()

# Use PostToolUse hooks to stop on critical errors
async def stop_on_error_hook(input_data, tool_use_id, context):
    if "critical" in str(input_data.get("tool_response", "")).lower():
        return {
            "continue_": False,
            "stopReason": "Critical error detected - halting for safety"
        }
```

---

### 6. Appears to be receiving global claude.md and MCPs etc., we should control what it does / doesn't get from this right? REPORT ONLY, NO EDITS

**Question:** TODO - appears to be recieving global claude.md and MCPs etc., we should control what it does / doesn't get from this right? REPORT ONLY, NO EDITS

**Findings:**

Controlling context injection in Claude Agent SDK:

**Setting Sources Control:**
```python
options = ClaudeAgentOptions(
    setting_sources=[],  # Empty list disables all external settings
    # Or specify: ["user", "project", "local"]
    strict_mcp_config=True,  # Only use explicitly configured MCP servers
)
```

By default, the SDK provider does NOT look for CLAUDE.md or slash commands unless you explicitly enable `setting_sources`. This gives you full control over what context the agent receives.

**MCP Server Control:**
- Set `strict_mcp_config=True` to only allow configured servers
- Explicitly define which MCP servers can be used
- Be aware that any MCP server can be an injection point - even trusted servers can read potentially malicious content

---

### 7. Do claude.md instructions get directly injected into context without 'read' operation being required? How does this come up in logs?

**Question:** TODO - do claude.md instructions get directly injected into context without 'read' operation being required? How does this come up in logs?

**Findings:**

CLAUDE.md injection behavior:

- **Default behavior**: The SDK does NOT automatically read CLAUDE.md files unless `setting_sources` includes "project" or "local"
- **When enabled**: CLAUDE.md content is injected as part of the system prompt, not through a Read tool operation
- **In logs**: This appears as part of the initial SystemMessage metadata or within the system_prompt field
- **Control**: Set `setting_sources=[]` to completely disable automatic file reading
- **Override**: Use `custom_system_prompt` to completely replace any default prompts

---

## Major Issues Research

### 1. Legal stuff in outputs - agent reusing same agent

**Issue:** There's mention of legal stuff in the outputs. It's re-using the same agent! CHECK. CONFIRM.

**Findings:**

**Session persistence occurs when:**
- Using `fork_session` parameter to branch from existing sessions
- Specifying a `session_id` that already exists
- Not properly cleaning up between runs

**Prevention:**
```python
# Always use new session (default behavior)
async with ClaudeSDKClient(options=options) as client:
    # This creates a new session
    await client.query("Your prompt")

# To explicitly fork a session (creates new branch)
options = ClaudeAgentOptions(
    fork_session="previous_session_id"  # Creates new session from old state
)
```

**Verification:** Check the `session_id` in SystemMessage init events - each new agent should have a unique ID unless explicitly forked.

---

### 2. Permissions ambiguity

**Issue:** Permissions are seemingly both set, and not set, and agent is just running into issues around it, not sure what it was/wasn't allowed to do and how it overcame it.

**Findings:**

**Common causes:**
- Multiple permission systems: `allowed_tools`, `permission_mode`, and `can_use_tool` callback can conflict
- `bypassPermissions` mode ignores other restrictions
- Some tools have implicit permissions (Read tools often work even when not explicitly allowed with a working_dir)

**Debugging permissions:**
```python
async def permission_debug_callback(tool_name, tool_input, context):
    print(f"Tool request: {tool_name}")
    print(f"Input: {tool_input}")
    print(f"Context: {context}")
    return PermissionResultAllow(behavior="allow")

options = ClaudeAgentOptions(
    can_use_tool=permission_debug_callback,
    permission_mode="default"  # Not bypassPermissions
)
```

**Best practice:** Use explicit `allowed_tools` list and `permission_mode="default"` for predictable behavior.

---

### 3. Logs unreadable with Rich due to verbosity

**Issue:** Logs still unreadable. Now with Rich, due to verbosity. Need markdown blocks, various summarizers / re-formatters. Try Langsmith Tracer?

**Findings:**

**Langsmith integration for better logging:**
```python
from langsmith.integrations.claude_agent_sdk import configure_claude_agent_sdk

# Enable tracing
configure_claude_agent_sdk()

# Set environment variables
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-api-key"
os.environ["LANGCHAIN_PROJECT"] = "your-project-name"
```

**Benefits:**
- Structured trace visualization in web UI
- Automatic message categorization
- Cost and token tracking
- Hierarchical view of tool calls
- Export capabilities for analysis
- Filters to focus on specific message types

**Alternative formatting solutions:**
- Filter messages by type (only show AssistantMessage and ToolUseBlock)
- Create custom message processors that summarize verbose outputs
- Use `include_partial_messages=False` to reduce streaming noise
- Implement custom Transport class for message filtering at source

---

## Summary

This research covers all TODO items and major issues identified in the cursor_process_explorer_cli.py file. Key findings include:

1. Multiple formatting options available (Rich HTML, Markdown ANSI, Langsmith)
2. Message filtering and summarization techniques
3. File operation tracking via ToolUseBlock monitoring
4. Permission configuration via ClaudeAgentOptions
5. Scope control and interruption mechanisms
6. Context injection control via setting_sources
7. CLAUDE.md injection behavior and logging
8. Session management best practices
9. Permission debugging strategies
10. Langsmith integration for better observability

