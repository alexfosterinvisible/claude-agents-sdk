#!/bin/bash

# Run agent tasks in parallel across all worktrees
# Usage: ./scripts/run-parallel.sh [task_script] [num_worktrees]

set -e

TASK_SCRIPT=${1:-"q-1.py"}
NUM_WORKTREES=${2:-5}
BASE_DIR=$(git rev-parse --show-toplevel)
WORKTREE_DIR="${BASE_DIR}/../worktrees"
LOG_DIR="${BASE_DIR}/logs/parallel-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$LOG_DIR"

echo "🚀 Running parallel agent tasks..."
echo "📝 Task script: $TASK_SCRIPT"
echo "🌳 Number of worktrees: $NUM_WORKTREES"
echo "📊 Logs will be saved to: $LOG_DIR"
echo ""

# Array to store background process PIDs
pids=()

# Launch tasks in parallel
for i in $(seq 1 $NUM_WORKTREES); do
    WORKTREE_PATH="${WORKTREE_DIR}/test-$i"
    LOG_FILE="${LOG_DIR}/test-$i.log"
    
    if [ ! -d "$WORKTREE_PATH" ]; then
        echo "⚠️  Worktree $i not found at $WORKTREE_PATH"
        echo "   Run './scripts/setup-worktrees.sh' first"
        exit 1
    fi
    
    echo "🏃 Starting task $i in worktree: $WORKTREE_PATH"
    
    # Run in background and capture PID
    (
        cd "$WORKTREE_PATH"
        echo "=== Starting test $i at $(date) ===" > "$LOG_FILE"
        echo "Working directory: $(pwd)" >> "$LOG_FILE"
        echo "Branch: $(git branch --show-current)" >> "$LOG_FILE"
        echo "" >> "$LOG_FILE"
        
        # Run the task
        python "$TASK_SCRIPT" >> "$LOG_FILE" 2>&1
        
        EXIT_CODE=$?
        echo "" >> "$LOG_FILE"
        echo "=== Finished test $i at $(date) with exit code $EXIT_CODE ===" >> "$LOG_FILE"
        exit $EXIT_CODE
    ) &
    
    pids+=($!)
done

echo ""
echo "⏳ Waiting for all tasks to complete..."
echo ""

# Wait for all processes and track results
success_count=0
failure_count=0
declare -a failed_tests

for i in $(seq 1 $NUM_WORKTREES); do
    pid=${pids[$((i-1))]}
    
    if wait $pid; then
        echo "✅ Test $i completed successfully"
        ((success_count++))
    else
        echo "❌ Test $i failed"
        ((failure_count++))
        failed_tests+=($i)
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTS SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Successful: $success_count / $NUM_WORKTREES"
echo "❌ Failed: $failure_count / $NUM_WORKTREES"
echo ""

if [ $failure_count -gt 0 ]; then
    echo "Failed test IDs: ${failed_tests[@]}"
    echo ""
fi

echo "📂 Detailed logs: $LOG_DIR"
echo ""

# Calculate success rate
success_rate=$((success_count * 100 / NUM_WORKTREES))
echo "Success rate: $success_rate%"
echo ""

if [ $success_rate -ge 80 ]; then
    echo "🎉 Good success rate! The solution appears reliable."
    exit 0
else
    echo "⚠️  Low success rate. Review the logs to investigate failures."
    exit 1
fi

