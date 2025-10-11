#!/bin/bash

# Setup multiple git worktrees for parallel agent testing
# Usage: ./scripts/setup-worktrees.sh [number_of_worktrees]

set -e

NUM_WORKTREES=${1:-5}
BASE_DIR=$(git rev-parse --show-toplevel)
WORKTREE_DIR="${BASE_DIR}/../worktrees"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🌳 Setting up $NUM_WORKTREES worktrees for parallel testing..."
echo "📂 Base directory: $BASE_DIR"
echo "🔀 Current branch: $CURRENT_BRANCH"

# Create worktree directory if it doesn't exist
mkdir -p "$WORKTREE_DIR"

# Clean up existing worktrees if any
echo "🧹 Cleaning up existing worktrees..."
for i in $(seq 1 $NUM_WORKTREES); do
    WORKTREE_PATH="${WORKTREE_DIR}/test-$i"
    if [ -d "$WORKTREE_PATH" ]; then
        git worktree remove "$WORKTREE_PATH" --force 2>/dev/null || true
    fi
done

# Create new worktrees
echo "🌱 Creating new worktrees..."
for i in $(seq 1 $NUM_WORKTREES); do
    WORKTREE_PATH="${WORKTREE_DIR}/test-$i"
    BRANCH_NAME="parallel-test-$i-$(date +%s)"
    
    echo "  Creating worktree $i at $WORKTREE_PATH"
    git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "$CURRENT_BRANCH"
    
    # Copy over any local config files that shouldn't be in git
    if [ -f "${BASE_DIR}/.env" ]; then
        cp "${BASE_DIR}/.env" "${WORKTREE_PATH}/.env"
    fi
done

echo "✅ All worktrees created successfully!"
echo ""
echo "📋 Worktree locations:"
for i in $(seq 1 $NUM_WORKTREES); do
    echo "  test-$i: ${WORKTREE_DIR}/test-$i"
done
echo ""
echo "🚀 Next step: Run './scripts/run-parallel.sh <task_description>'"

