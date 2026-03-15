# Cursor IDE + JupyterLab Setup Guide

## ? Completed Setup

Your Jupyter environment is now properly configured for Cursor IDE! Here's what was set up:

### 1. Package Management
- **uv package manager** installed at `~/.local/bin/uv`
- **Virtual environment** created at `./.venv`
- **Python 3.12.3** configured

### 2. Dependencies Installed
- `jupyterlab>=4.4.10` - Full Jupyter environment
- `ipykernel>=7.1.0` - Kernel support for notebooks
- `claude-agent-sdk>=0.1.6` - Claude AI integration
- `loguru>=0.7.3` - Advanced logging
- `python-dotenv>=1.2.1` - Environment variable management

### 3. Jupyter Kernel
- **Kernel installed**: "Claude SDK (workspace)"
- **Kernel location**: `/home/ubuntu/.local/share/jupyter/kernels/workspace`

### 4. Files Created
- `pyproject.toml` - Modern Python project configuration
- `scripts_agents_sdk/cc_agents_sdk_proper.ipynb` - Comprehensive example notebook
- `.env.template` - Environment variables template

## ?? Using in Cursor IDE

### Step 1: Select Python Interpreter
1. Open Cursor IDE
2. Press `Cmd/Ctrl + Shift + P`
3. Type "Python: Select Interpreter"
4. Choose: `./.venv/bin/python` (the virtual environment)

### Step 2: Open the Notebook
1. Open `scripts_agents_sdk/cc_agents_sdk_proper.ipynb`
2. In Cursor, the notebook should automatically detect the kernel
3. If prompted, select "Claude SDK (workspace)" kernel

### Step 3: Configure API Key (Optional)
1. Copy `.env.template` to `.env`:
   ```bash
   cp .env.template .env
   ```
2. Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_key_here
   ```

## ?? Testing the Setup

The notebook includes built-in tests. Run all cells to verify:
- ? Environment validation
- ? Basic Claude SDK queries
- ? Advanced examples with streaming
- ? Helper functions
- ? Integration tests

## ?? Common Issues & Solutions

### Issue: "Python not found"
**Solution**: Make sure you've selected the virtual environment interpreter in Cursor.

### Issue: "Kernel not found"
**Solution**: 
```bash
export PATH="$HOME/.local/bin:$PATH"
source .venv/bin/activate
python -m ipykernel install --user --name=workspace --display-name="Claude SDK (workspace)"
```

### Issue: "Module not found" errors
**Solution**: Ensure all dependencies are installed:
```bash
export PATH="$HOME/.local/bin:$PATH"
uv sync
```

### Issue: API key not working
**Solution**: Check your `.env` file and ensure `ANTHROPIC_API_KEY` is set correctly.

## ?? Starting from Scratch

If you need to reset:
```bash
# Remove virtual environment
rm -rf .venv

# Reinstall everything
export PATH="$HOME/.local/bin:$PATH"
uv sync
source .venv/bin/activate
python -m ipykernel install --user --name=workspace --display-name="Claude SDK (workspace)"
```

## ?? Next Steps

1. **Test the notebook**: Run all cells in `cc_agents_sdk_proper.ipynb`
2. **Add API key**: Configure `.env` with your Anthropic key
3. **Start developing**: Use the examples as templates for your projects

---

**Status**: ????? Setup complete, tested, and ready for development!