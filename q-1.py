import asyncio
from pathlib import Path

from claude_agent_sdk import ClaudeAgentOptions, query

CWD = Path("~/agent-sandpits/25oct/test1").expanduser().resolve()  # working directory for agent1
CWD.mkdir(parents=True, exist_ok=True)  # make dir if doesn't exist.

async def main():
    
    
    print(f"CWD: {CWD}")
    options = ClaudeAgentOptions(
        system_prompt="You are an expert Python developer",
        permission_mode="acceptEdits",
        cwd=CWD,
    )

    async for message in query(prompt="Create a Python web server", options=options):
        print(message)


asyncio.run(main())

# okay! so this streamed agent logs which is cool, but v hard to read. no markdown rendering ofc.
# check out the other options.

