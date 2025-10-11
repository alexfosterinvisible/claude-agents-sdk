#!/bin/bash

# Run parallel tests in dev containers
# Usage: ./scripts/run-in-container.sh [task_script] [num_worktrees]

set -e

TASK_SCRIPT=${1:-"q-1.py"}
NUM_WORKTREES=${2:-5}
BASE_DIR=$(git rev-parse --show-toplevel)
WORKTREE_DIR="${BASE_DIR}/../worktrees"
LOG_DIR="${BASE_DIR}/logs/container-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$LOG_DIR"

echo "🐳 Running parallel agent tasks in dev containers..."
echo "📝 Task script: $TASK_SCRIPT"
echo "🌳 Number of worktrees: $NUM_WORKTREES"
echo "📊 Logs will be saved to: $LOG_DIR"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Array to store background process PIDs
pids=()

# Launch tasks in parallel containers
for i in $(seq 1 $NUM_WORKTREES); do
    WORKTREE_PATH="${WORKTREE_DIR}/test-$i"
    LOG_FILE="${LOG_DIR}/test-$i.log"
    CONTAINER_NAME="agent-test-$i-$(date +%s)"
    
    if [ ! -d "$WORKTREE_PATH" ]; then
        echo "⚠️  Worktree $i not found at $WORKTREE_PATH"
        echo "   Run './scripts/setup-worktrees.sh' first"
        exit 1
    fi
    
    echo "🐳 Starting container $i: $CONTAINER_NAME"
    
    # Run in background
    (
        echo "=== Starting containerized test $i at $(date) ===" > "$LOG_FILE"
        echo "Container: $CONTAINER_NAME" >> "$LOG_FILE"
        echo "Worktree: $WORKTREE_PATH" >> "$LOG_FILE"
        echo "" >> "$LOG_FILE"
        
        # Build and run in container
        docker run --rm \
            --name "$CONTAINER_NAME" \
            -v "$WORKTREE_PATH:/workspace" \
            -w /workspace \
            python:3.11-slim \
            bash -c "pip install -q -r requirements.txt && python $TASK_SCRIPT" \
            >> "$LOG_FILE" 2>&1
        
        EXIT_CODE=$?
        echo "" >> "$LOG_FILE"
        echo "=== Finished test $i at $(date) with exit code $EXIT_CODE ===" >> "$LOG_FILE"
        exit $EXIT_CODE
    ) &
    
    pids+=($!)
    
    # Small delay to avoid overwhelming Docker
    sleep 0.5
done

echo ""
echo "⏳ Waiting for all containers to complete..."
echo ""

# Wait for all processes and track results
success_count=0
failure_count=0
declare -a failed_tests

for i in $(seq 1 $NUM_WORKTREES); do
    pid=${pids[$((i-1))]}
    
    if wait $pid; then
        echo "✅ Container test $i completed successfully"
        ((success_count++))
    else
        echo "❌ Container test $i failed"
        ((failure_count++))
        failed_tests+=($i)
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 CONTAINER RESULTS SUMMARY"
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

