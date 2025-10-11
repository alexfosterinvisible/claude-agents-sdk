.PHONY: help setup run run-containers cleanup test-quick test-thorough install

# Default target
help:
	@echo "🚀 Claude Agents SDK - Parallel Testing"
	@echo ""
	@echo "Quick workflows:"
	@echo "  make test-quick      - Run 5 parallel tests (fast)"
	@echo "  make test-thorough   - Run 10 parallel tests in containers (thorough)"
	@echo ""
	@echo "Individual commands:"
	@echo "  make install         - Install dependencies"
	@echo "  make setup          - Setup 5 worktrees"
	@echo "  make run            - Run tests in parallel"
	@echo "  make run-containers - Run tests in Docker containers"
	@echo "  make cleanup        - Remove all worktrees"
	@echo ""
	@echo "Custom usage:"
	@echo "  make setup N=10     - Setup 10 worktrees"
	@echo "  make run N=10 SCRIPT=my-test.py - Run custom script"

# Variables with defaults
N ?= 5
SCRIPT ?= q-1.py

install:
	@echo "📦 Installing dependencies..."
	pip install -r requirements.txt

setup:
	@echo "🌳 Setting up $(N) worktrees..."
	./scripts/setup-worktrees.sh $(N)

run:
	@echo "🏃 Running tests in parallel..."
	./scripts/run-parallel.sh $(SCRIPT) $(N)

run-containers:
	@echo "🐳 Running tests in containers..."
	./scripts/run-in-container.sh $(SCRIPT) $(N)

cleanup:
	@echo "🧹 Cleaning up worktrees..."
	./scripts/cleanup-worktrees.sh

# Composite workflows
test-quick: setup run cleanup
	@echo "✅ Quick test complete!"

test-thorough: setup run-containers cleanup
	@echo "✅ Thorough test complete!"

# Convenience targets
logs:
	@echo "📊 Recent test logs:"
	@ls -lt logs/ | head -n 10

status:
	@echo "🌳 Current worktrees:"
	@git worktree list
	@echo ""
	@echo "📂 Logs:"
	@ls -ld logs/*/ 2>/dev/null | wc -l | xargs echo "  Total test runs:"

