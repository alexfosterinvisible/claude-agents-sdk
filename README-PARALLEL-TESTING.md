# Parallel Testing with Dev Containers and Git Worktrees

This setup allows you to run the same agent task 5-10 times in parallel using git worktrees and dev containers to ensure you get a working solution every time.

## 🎯 Overview

This testing strategy uses:
- **Git Worktrees**: Creates isolated copies of your repository
- **Dev Containers**: Ensures consistent, isolated environments
- **Parallel Execution**: Runs multiple tests simultaneously
- **Automated Analysis**: Calculates success rates and identifies failures

## 🚀 Quick Start

### Option 1: Quick Parallel Test (No Containers)

```bash
# 1. Setup worktrees (creates 5 by default)
./scripts/setup-worktrees.sh

# 2. Run tests in parallel
./scripts/run-parallel.sh q-1.py

# 3. Cleanup when done
./scripts/cleanup-worktrees.sh
```

### Option 2: Containerized Testing (Recommended)

```bash
# 1. Setup worktrees
./scripts/setup-worktrees.sh 10  # Create 10 worktrees

# 2. Run in containers
./scripts/run-in-container.sh q-1.py 10

# 3. Cleanup
./scripts/cleanup-worktrees.sh
```

### Option 3: Using Cursor Dev Containers

```bash
# 1. Open in dev container (Command Palette: "Reopen in Container")
# 2. Inside the container, setup worktrees
./scripts/setup-worktrees.sh 8

# 3. Run tests
./scripts/run-parallel.sh your-script.py 8

# 4. Review results in logs/
```

## 📁 Directory Structure

After setup, your structure will look like:

```
claude-agents-sdk/              # Main repository
├── .devcontainer/
│   └── devcontainer.json
├── scripts/
│   ├── setup-worktrees.sh      # Create worktrees
│   ├── run-parallel.sh         # Run tests in parallel
│   ├── run-in-container.sh     # Run in containers
│   └── cleanup-worktrees.sh    # Cleanup
├── logs/                       # Test logs (auto-created)
└── q-1.py                      # Your test script

../worktrees/                   # Worktrees directory (auto-created)
├── test-1/                     # Isolated copy 1
├── test-2/                     # Isolated copy 2
├── test-3/                     # Isolated copy 3
└── ...
```

## 🛠️ Detailed Usage

### Setup Worktrees

```bash
# Create default number (5) of worktrees
./scripts/setup-worktrees.sh

# Create specific number of worktrees
./scripts/setup-worktrees.sh 10

# Creates branches: parallel-test-1-<timestamp>, parallel-test-2-<timestamp>, etc.
```

### Run Tests

**Option A: Native Execution**
```bash
./scripts/run-parallel.sh <script> [num_worktrees]

# Examples:
./scripts/run-parallel.sh q-1.py
./scripts/run-parallel.sh my-test.py 10
```

**Option B: Containerized Execution**
```bash
./scripts/run-in-container.sh <script> [num_worktrees]

# Examples:
./scripts/run-in-container.sh q-1.py
./scripts/run-in-container.sh my-test.py 8
```

### Review Results

All logs are saved with timestamps:

```bash
# View logs directory
ls -la logs/

# View specific test log
cat logs/parallel-20250109-143022/test-1.log

# Search for errors across all logs
grep -r "ERROR" logs/parallel-20250109-143022/

# Compare successful vs failed runs
diff logs/parallel-20250109-143022/test-1.log logs/parallel-20250109-143022/test-5.log
```

### Cleanup

```bash
# Remove all worktrees and test branches
./scripts/cleanup-worktrees.sh

# Manual cleanup if needed
git worktree list
git worktree remove ../worktrees/test-1 --force
```

## 🐳 Dev Container Features

The `.devcontainer/devcontainer.json` provides:

- **Python 3.11** runtime
- **Git** for version control
- **Docker-in-Docker** for nested containers
- **SSH key mounting** for git operations
- **Auto-installation** of requirements.txt

### Opening in Dev Container

**Method 1: VS Code/Cursor UI**
1. Open the folder in Cursor
2. Command Palette (⌘+Shift+P)
3. Select "Dev Containers: Reopen in Container"

**Method 2: CLI**
```bash
CONF='{"settingType":"config", "workspacePath": "/Users/alex/Code3b/claude-agents-sdk", "devcontainerPath": "/Users/alex/Code3b/claude-agents-sdk/.devcontainer/devcontainer.json"}'
HEX_CONF=$(printf "$CONF" | od -An -tx1 | tr -d '[\n\t ]')
cursor --folder-uri "vscode-remote://dev-container+${HEX_CONF}/workspaces/claude-agents-sdk"
```

## 📊 Understanding Results

The scripts provide:
- **Real-time progress** as tests run
- **Success/failure counts** for each test
- **Success rate percentage** (target: ≥80%)
- **Exit code 0** if success rate ≥ 80%
- **Exit code 1** if success rate < 80%

Example output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESULTS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Successful: 8 / 10
❌ Failed: 2 / 10

Failed test IDs: 3 7

📂 Detailed logs: logs/parallel-20250109-143022

Success rate: 80%

🎉 Good success rate! The solution appears reliable.
```

## 🎓 Use Cases

### Testing Agent Reliability
Run the same agent task multiple times to ensure consistent results:
```bash
./scripts/setup-worktrees.sh 10
./scripts/run-parallel.sh agent-task.py 10
```

### Testing Different Prompts
Modify the script in each worktree manually, then run:
```bash
# Each worktree can have different prompt variations
./scripts/run-parallel.sh test-variants.py 5
```

### CI/CD Integration
```bash
# In your CI pipeline
./scripts/setup-worktrees.sh 5
./scripts/run-in-container.sh q-1.py 5
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "All tests passed with good success rate"
else
    echo "Tests failed or low success rate"
    exit 1
fi
```

## 🔧 Customization

### Modify Dev Container

Edit `.devcontainer/devcontainer.json`:
```json
{
  "image": "python:3.11",  // Change base image
  "postCreateCommand": "...",  // Add setup commands
  "features": {
    // Add more features
  }
}
```

### Change Success Threshold

Edit the scripts and modify:
```bash
if [ $success_rate -ge 80 ]; then  # Change 80 to your threshold
```

### Add Pre-test Setup

Edit `run-parallel.sh` and add commands before `python "$TASK_SCRIPT"`:
```bash
# Install additional dependencies
pip install extra-package

# Set environment variables
export MY_VAR="value"

# Run the task
python "$TASK_SCRIPT"
```

## 🐛 Troubleshooting

### Worktrees Already Exist
```bash
./scripts/cleanup-worktrees.sh
./scripts/setup-worktrees.sh
```

### Docker Not Running
```bash
# macOS
open -a Docker

# Or check status
docker info
```

### Permission Denied on Scripts
```bash
chmod +x scripts/*.sh
```

### Out of Disk Space (Many Logs)
```bash
# Clean old logs (keep last 5)
cd logs
ls -t | tail -n +6 | xargs rm -rf
```

## 📚 Additional Resources

- [Git Worktrees Documentation](https://git-scm.com/docs/git-worktree)
- [Dev Containers Specification](https://containers.dev/)
- [Cursor Dev Containers Guide](cursor-dev-containers.md)

## 💡 Tips

1. **Start Small**: Begin with 5 worktrees, scale up as needed
2. **Monitor Resources**: Each container uses memory/CPU
3. **Use Logs**: Always review logs for failed tests
4. **Clean Up**: Run cleanup script regularly
5. **Git Ignore Logs**: Add `logs/` to `.gitignore`

## 🔒 Security

⚠️ **Important**: 
- Don't commit sensitive data to worktrees
- Use `.env` files for secrets (they're copied to each worktree)
- Be cautious with agent permissions in containers
- Review the cursor-dev-containers.md security warnings

