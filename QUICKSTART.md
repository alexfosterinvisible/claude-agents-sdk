# ⚡ Quick Start Guide

## The Fastest Way to Test Your Agents in Parallel

### 🎯 Goal
Run your agent code 5-10 times in parallel to ensure reliability, using isolated environments (git worktrees + optional containers).

---

## 🚀 Three Ways to Get Started

### 1️⃣ Super Quick (3 commands)

```bash
make test-quick
```

That's it! This will:
- Create 5 worktrees
- Run `q-1.py` in parallel 5 times
- Show you success rate
- Clean up automatically

---

### 2️⃣ Manual Control

```bash
# Step 1: Create isolated environments
./scripts/setup-worktrees.sh 5

# Step 2: Run your tests
./scripts/run-parallel.sh q-1.py 5

# Step 3: Check the results
ls logs/parallel-*/

# Step 4: Clean up
./scripts/cleanup-worktrees.sh
```

---

### 3️⃣ Containerized (Most Isolated)

```bash
# Use Docker containers for maximum isolation
make test-thorough

# Or manually:
./scripts/setup-worktrees.sh 10
./scripts/run-in-container.sh q-1.py 10
./scripts/cleanup-worktrees.sh
```

---

## 📊 What Happens During a Test Run

```
┌─────────────────────────────────────────┐
│  Main Repository                        │
│  /Users/alex/Code3b/claude-agents-sdk   │
└─────────────┬───────────────────────────┘
              │
              │ setup-worktrees.sh creates
              ▼
┌─────────────────────────────────────────┐
│  Worktrees Created                      │
├─────────────────────────────────────────┤
│  ../worktrees/test-1/  (isolated copy)  │
│  ../worktrees/test-2/  (isolated copy)  │
│  ../worktrees/test-3/  (isolated copy)  │
│  ../worktrees/test-4/  (isolated copy)  │
│  ../worktrees/test-5/  (isolated copy)  │
└─────────────┬───────────────────────────┘
              │
              │ run-parallel.sh or run-in-container.sh
              ▼
┌─────────────────────────────────────────┐
│  Parallel Execution                     │
├─────────────────────────────────────────┤
│  🏃 Task 1 running... ──→ [Container]   │
│  🏃 Task 2 running... ──→ [Container]   │
│  🏃 Task 3 running... ──→ [Container]   │
│  🏃 Task 4 running... ──→ [Container]   │
│  🏃 Task 5 running... ──→ [Container]   │
└─────────────┬───────────────────────────┘
              │
              │ Results logged
              ▼
┌─────────────────────────────────────────┐
│  Results Summary                        │
├─────────────────────────────────────────┤
│  ✅ Successful: 4 / 5                   │
│  ❌ Failed: 1 / 5                       │
│  Success rate: 80%                      │
│  📂 logs/parallel-20250109-143022/      │
└─────────────────────────────────────────┘
```

---

## 📝 Example Output

```bash
$ make test-quick

🌳 Setting up 5 worktrees for parallel testing...
📂 Base directory: /Users/alex/Code3b/claude-agents-sdk
🔀 Current branch: main

🌱 Creating new worktrees...
  Creating worktree 1 at ../worktrees/test-1
  Creating worktree 2 at ../worktrees/test-2
  Creating worktree 3 at ../worktrees/test-3
  Creating worktree 4 at ../worktrees/test-4
  Creating worktree 5 at ../worktrees/test-5

✅ All worktrees created successfully!

🚀 Running parallel agent tasks...
📝 Task script: q-1.py
🌳 Number of worktrees: 5

🏃 Starting task 1 in worktree: ../worktrees/test-1
🏃 Starting task 2 in worktree: ../worktrees/test-2
🏃 Starting task 3 in worktree: ../worktrees/test-3
🏃 Starting task 4 in worktree: ../worktrees/test-4
🏃 Starting task 5 in worktree: ../worktrees/test-5

⏳ Waiting for all tasks to complete...

✅ Test 1 completed successfully
✅ Test 2 completed successfully
❌ Test 3 failed
✅ Test 4 completed successfully
✅ Test 5 completed successfully

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESULTS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Successful: 4 / 5
❌ Failed: 1 / 5

Failed test IDs: 3

📂 Detailed logs: logs/parallel-20250109-143022

Success rate: 80%

🎉 Good success rate! The solution appears reliable.
```

---

## 🔍 Debugging Failed Tests

```bash
# View the failed test log
cat logs/parallel-20250109-143022/test-3.log

# Compare failed vs successful
diff logs/parallel-20250109-143022/test-1.log logs/parallel-20250109-143022/test-3.log

# Search for errors
grep -r "ERROR\|Exception\|Traceback" logs/parallel-20250109-143022/
```

---

## 🎓 Common Workflows

### Test Different Agent Prompts
```bash
# Create worktrees
make setup N=10

# Manually edit prompts in each worktree
code ../worktrees/test-1/q-1.py  # Edit different variations

# Run all at once
make run N=10

# See which prompt performed best
make logs
```

### Test Against Production
```bash
# Run in containers for production-like isolation
make test-thorough

# Review detailed results
cat logs/container-*/test-*.log
```

### CI/CD Pipeline
```bash
# In your CI script
make test-quick
if [ $? -eq 0 ]; then
    echo "Tests passed with good reliability!"
    deploy_to_production
fi
```

---

## 🛠️ Customization

### Change Number of Tests
```bash
make setup N=10
make run N=10 SCRIPT=my-agent.py
```

### Use Your Own Script
```bash
make run SCRIPT=custom-agent.py N=5
```

### Adjust Success Threshold
Edit `scripts/run-parallel.sh` line ~95:
```bash
if [ $success_rate -ge 80 ]; then  # Change to 90 for stricter
```

---

## 🐳 Dev Container Integration

### Option 1: UI
1. Open project in Cursor
2. `⌘+Shift+P` → "Dev Containers: Reopen in Container"
3. Wait for container to build
4. Run `make test-quick` inside container

### Option 2: CLI
```bash
CONF='{"settingType":"config", "workspacePath": "/Users/alex/Code3b/claude-agents-sdk", "devcontainerPath": "/Users/alex/Code3b/claude-agents-sdk/.devcontainer/devcontainer.json"}'
HEX_CONF=$(printf "$CONF" | od -An -tx1 | tr -d '[\n\t ]')
cursor --folder-uri "vscode-remote://dev-container+${HEX_CONF}/workspaces/claude-agents-sdk"
```

---

## 💡 Pro Tips

1. **Start small**: Use 5 tests initially, scale to 10+ once you're comfortable
2. **Watch resources**: Each container uses ~200MB RAM
3. **Keep logs**: Don't delete old logs until you've analyzed trends
4. **Automate**: Add `make test-thorough` to your pre-deploy checklist
5. **Iterate**: Failed tests reveal edge cases - fix and re-run

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Permission denied" on scripts | `chmod +x scripts/*.sh` |
| "Worktrees already exist" | `make cleanup` then retry |
| Docker not running | `open -a Docker` (macOS) |
| Out of disk space | Clean old logs: `rm -rf logs/parallel-2024*` |
| Tests hanging | Check `docker ps` and kill stuck containers |

---

## 📚 More Information

- **Full documentation**: [README-PARALLEL-TESTING.md](README-PARALLEL-TESTING.md)
- **Main README**: [README.md](README.md)
- **Dev Containers guide**: Check `/Users/alex/Code3b/UtilRepos/ScriptCentral/cursor-dev-containers.md`

---

## ⚡ TL;DR

```bash
# Fastest way to test reliability
make test-quick

# Most thorough testing
make test-thorough

# Custom testing
make setup N=10
make run N=10 SCRIPT=my-agent.py
make cleanup
```

**Done! You're now running agents in parallel with isolated environments.** 🎉

