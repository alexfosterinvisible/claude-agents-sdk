# Claude Agents SDK

## Overview

Python SDK for building Claude agent applications with support for async operations, streaming responses, and flexible configuration.

## Project Structure

```
claude-agents-sdk/
├── .devcontainer/          # Dev container configuration
├── .specs/                 # Project specifications
│   ├── ai_specs/          # AI-generated specs
│   └── human_specs/       # Human-written specs
├── .venv/                 # Virtual environment (Python 3.12+)
├── docs/                  # Documentation
│   └── apis/             # API documentation
├── scripts/               # Utility scripts
│   ├── setup-worktrees.sh
│   ├── run-parallel.sh
│   ├── run-in-container.sh
│   └── cleanup-worktrees.sh
├── tests/                 # Test suite
├── logs/                  # Test logs (auto-generated)
├── .gitignore
├── justfile              # Minimalistic cheatsheet for common commands
├── Makefile              # Build and automation
├── README.md             # User-facing documentation
├── requirements.txt      # Python dependencies
└── zTasks.md            # Task tracking (gitignored)
```

## Quick Start

### Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Using Justfile

```bash
just setup    # Set up virtual environment
just test     # Run tests
just install  # Install package in development mode
just clean    # Clean build artifacts
```

## Development Conventions

### Virtual Environment
- Use `.venv` for virtual environment directory
- Python 3.12+ required

### Configuration
- Store sensitive keys in `.env` file (never commit)
- Access via `python-dotenv`
- Config params in global CFG singleton or config module

### Testing
- All tests in `./tests` directory
- Run tests frequently during development to prevent regressions
- Use parallel testing setup for reliability checks

### Module Structure
- Add blank `__init__.py` to all directories to make them modules
- Follow SDK structure conventions

### Git Workflow
- Commit regularly during operations for easy save points
- Use conventional commit tags: `<feat>`, `<fix>`, etc.
- Sign commits with `-Claude` for clarity

## Core Features

### Claude Agent SDK

The SDK provides:
- Async/await API for Claude agents
- Streaming message responses
- Configurable agent options (system prompts, permissions, working directory)
- Support for multiple permission modes

### Parallel Testing

Built-in support for reliability testing:
- Run same task multiple times in isolated environments
- Uses git worktrees for isolation
- Optional containerized testing
- Automated success rate analysis

See `README-PARALLEL-TESTING.md` for details.

## Specification

### Rebuild Instructions

To rebuild this repository from scratch:

1. **Initialize Python project**
   ```bash
   mkdir claude-agents-sdk
   cd claude-agents-sdk
   python -m venv .venv
   source .venv/bin/activate
   ```

2. **Install core dependencies**
   ```bash
   pip install anthropic pydantic httpx python-dotenv
   pip install pytest pytest-asyncio  # dev dependencies
   ```

3. **Create directory structure**
   ```bash
   mkdir -p .specs/{ai_specs,human_specs}
   mkdir -p docs/apis
   mkdir -p scripts
   mkdir -p tests
   mkdir -p logs
   ```

4. **Set up parallel testing scripts**
   - Create worktree management scripts in `scripts/`
   - Configure dev container with Python 3.12+
   - Set up automated test running and log analysis

5. **Configure SDK package**
   - Install `claude_agent_sdk` package
   - Set up async query interface
   - Implement ClaudeAgentOptions configuration

6. **Set up development tools**
   - Add justfile for command shortcuts
   - Create Makefile for build automation
   - Configure .gitignore for Python projects

## Design Choices

### Async-First Architecture
The SDK uses async/await patterns throughout for efficient I/O operations and streaming support.

### Worktree-Based Testing
Parallel testing uses git worktrees rather than copying directories, providing true isolation while being space-efficient.

### Permission Modes
Flexible permission system allows different levels of agent autonomy from fully automated to manual approval.

## Testing Strategy

### Unit Tests
- Test individual SDK components
- Mock external API calls for speed
- Run via `just test`

### Reliability Tests
- Run same agent task multiple times
- Measure success rates (target: ≥80%)
- Identify intermittent failures
- Use containerized or native execution

### Regression Prevention
After completing features, add single-line test descriptions to `./tests`:
- "if [function] does/doesn't x then broken"
- Include these in test output for clarity

## Contributing

When adding new features:
1. Update CLAUDE.md specification
2. Add tests before implementing
3. Run existing tests to prevent regressions
4. Update zTasks.md to track progress
5. Commit regularly with descriptive messages

## Notes

- This SDK is designed for building agent applications
- Focus on async patterns and streaming
- Prioritize reliability through parallel testing
- Keep documentation synchronized with code
