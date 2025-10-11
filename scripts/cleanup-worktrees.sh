#!/bin/bash

# Clean up all test worktrees
# Usage: ./scripts/cleanup-worktrees.sh

set -e

BASE_DIR=$(git rev-parse --show-toplevel)
WORKTREE_DIR="${BASE_DIR}/../worktrees"

echo "🧹 Cleaning up test worktrees..."

if [ ! -d "$WORKTREE_DIR" ]; then
    echo "No worktrees directory found. Nothing to clean up."
    exit 0
fi

# List all worktrees (excluding main)
worktrees=$(git worktree list --porcelain | grep "^worktree " | cut -d' ' -f2 | grep -v "^${BASE_DIR}$" || true)

if [ -z "$worktrees" ]; then
    echo "No test worktrees found."
else
    echo "Found worktrees to remove:"
    echo "$worktrees"
    echo ""
    
    # Remove each worktree
    while IFS= read -r worktree; do
        if [ -n "$worktree" ]; then
            echo "Removing: $worktree"
            git worktree remove "$worktree" --force 2>/dev/null || true
        fi
    done <<< "$worktrees"
fi

# Clean up branches
echo ""
echo "🗑️  Cleaning up test branches..."
git branch | grep "parallel-test-" | xargs -r git branch -D 2>/dev/null || true

# Remove worktree directory if empty
if [ -d "$WORKTREE_DIR" ] && [ -z "$(ls -A "$WORKTREE_DIR")" ]; then
    rmdir "$WORKTREE_DIR"
    echo "Removed empty worktrees directory"
fi

echo ""
echo "✅ Cleanup complete!"

