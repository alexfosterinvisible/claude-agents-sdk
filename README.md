# Claude Agents SDK

A Python SDK for working with Claude agents.

## Quick Start

```bash
pip install -r requirements.txt
python q-1.py
```

## 🧪 Parallel Testing with Dev Containers

This repository includes a complete setup for running agent tasks in parallel using git worktrees and dev containers. This is perfect for:

- **Testing reliability**: Run the same task 5-10 times to ensure consistent results
- **Isolated environments**: Each test runs in its own worktree and (optionally) container
- **Automated analysis**: Get success rates and detailed logs for debugging

### Quick Start (3 commands)

```bash
./scripts/setup-worktrees.sh 5        # Create 5 isolated worktrees
./scripts/run-parallel.sh q-1.py 5    # Run tests in parallel
./scripts/cleanup-worktrees.sh        # Clean up when done
```

### Full Documentation

See **[README-PARALLEL-TESTING.md](README-PARALLEL-TESTING.md)** for:
- Detailed usage instructions
- Dev container setup
- Containerized testing (recommended)
- CI/CD integration
- Troubleshooting guide

## Project Structure

```
claude-agents-sdk/
├── .devcontainer/          # Dev container configuration
├── scripts/                # Automation scripts
│   ├── setup-worktrees.sh
│   ├── run-parallel.sh
│   ├── run-in-container.sh
│   └── cleanup-worktrees.sh
├── logs/                   # Test logs (auto-generated)
├── q-1.py                  # Example agent script
└── README-PARALLEL-TESTING.md  # Full testing guide
```

## Usage

### Basic Agent Usage

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are an expert Python developer",
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python web server",
        options=options
    ):
        print(message)

asyncio.run(main())
```

### Running in Dev Container

1. Open in Cursor
2. Command Palette → "Dev Containers: Reopen in Container"
3. Container will auto-install dependencies from `requirements.txt`

## Development

### Running Tests in Parallel

```bash
# Setup
./scripts/setup-worktrees.sh 10

# Run in containers (isolated)
./scripts/run-in-container.sh q-1.py 10

# Or run natively (faster)
./scripts/run-parallel.sh q-1.py 10

# Check results
cat logs/parallel-*/test-*.log

# Cleanup
./scripts/cleanup-worktrees.sh
```

### Success Rate Analysis

The scripts automatically calculate success rates:
- ✅ **≥80%**: Considered reliable
- ⚠️ **<80%**: Needs investigation

Failed tests are logged with their IDs for easy debugging.

## Requirements

- Python 3.11+
- Docker (for containerized testing)
- Git 2.5+ (for worktrees)

## License

[Your License Here]
