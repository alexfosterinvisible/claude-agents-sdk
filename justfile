# Claude Agents SDK - Minimalistic cheatsheet for running scripts, tests, setup etc.

# Set up virtual environment and install dependencies
setup:
    python -m venv .venv
    source .venv/bin/activate && pip install -r requirements.txt

# Run tests
test:
    source .venv/bin/activate && python -m pytest tests/ -v

# Run tests with coverage
test-cov:
    source .venv/bin/activate && python -m pytest tests/ --cov=claude_agent_sdk --cov-report=html

# Run parallel reliability tests (requires worktrees setup)
test-parallel n="5":
    ./scripts/setup-worktrees.sh {{n}}
    ./scripts/run-parallel.sh q-1.py {{n}}
    ./scripts/cleanup-worktrees.sh

# Format code with black
format:
    source .venv/bin/activate && black . --exclude .venv

# Check code style
lint:
    source .venv/bin/activate && flake8 . --exclude .venv

# Type checking
typecheck:
    source .venv/bin/activate && mypy .

# Clean up build artifacts
clean:
    rm -rf build/ dist/ *.egg-info/ .pytest_cache/ htmlcov/ .coverage
    find . -type d -name __pycache__ -exec rm -rf {} +
    find . -type f -name "*.pyc" -delete
    rm -rf logs/

# Install package in development mode
install:
    source .venv/bin/activate && pip install -e .

# Build package for distribution
build:
    source .venv/bin/activate && python -m build

# Run example agent script
example script="q-1.py":
    source .venv/bin/activate && python {{script}}

# Show help
help:
    @just --list
