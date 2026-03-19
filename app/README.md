# SDLC Planner: Flowchart Visualization System

## Overview

SDLC Planner is an interactive flowchart visualization system that automatically generates visual representations of repository structure (files, folders, functions, classes) with full git integration, version control history tracking, and context linking.

## Features

- **Automatic Code Analysis**: Parses Python, JavaScript, and TypeScript files to extract functions and classes
- **Git Integration**: Shows commit history, branches, and blame data linked to code elements
- **Interactive Layout**: Drag-and-drop interface for positioning nodes with persistent layout storage
- **Dependency Visualization**: Displays import dependencies and file relationships
- **Export Options**: Generate Mermaid diagrams and ASCII flowcharts

## Quick Start

### Prerequisites

- Python 3.12+
- uv package manager
- Git repository to analyze

### Installation

```bash
# Install backend dependencies
cd app/server
uv sync
```

### Running the Server

```bash
# From project root
./scripts/start_server.sh

# Or using justfile
just sdlc-server
```

The API server will start on `http://localhost:8000`.

### API Endpoints

- `GET /` - Health check
- `GET /api/repo/structure?path={repo_path}` - Get repository structure
- `GET /api/repo/dependencies?path={repo_path}` - Get import dependencies
- `GET /api/git/history?path={repo_path}&max_count={n}` - Get commit history
- `GET /api/git/branches?path={repo_path}` - Get git branches
- `GET /api/layout?file={layout_file}` - Load saved layout
- `POST /api/layout` - Save layout positions
- `GET /api/layout/infer?path={repo_path}` - Auto-generate layout

### Configuration

Edit `.env` file in project root:

```env
REPO_PATH=.
LAYOUT_FILE=./layout.yaml
API_HOST=0.0.0.0
API_PORT=8000
ENABLE_TREESITTER=true
ENABLE_GIT_INTEGRATION=true
```

## Architecture

### Backend (Python + FastAPI)

- **FastAPI** - REST API server
- **GitPython** - Git operations and history
- **TreeSitter** - Multi-language code parsing
- **PyYAML** - Layout persistence

### Core Modules

- `repo_analyzer.py` - Directory tree analysis
- `code_parser.py` - AST/TreeSitter parsing for Python/JS/TS
- `dependency_analyzer.py` - Import dependency extraction
- `git_integration.py` - Commit history and blame data
- `layout_manager.py` - YAML layout persistence
- `position_inference.py` - Automatic node positioning
- `thread_parser.py` - Claude Code thread parsing

## Testing

```bash
# Run all tests
just sdlc-test

# Run specific test file
cd app/server && uv run pytest tests/test_main.py -v
```

## Development

### Adding Support for New Languages

1. Install TreeSitter language parser: `uv add tree-sitter-{language}`
2. Add parser in `code_parser.py`
3. Update `parse_file()` to handle new extension

### Customizing Layout Algorithm

Edit `position_inference.py` to implement different layout strategies (force-directed, circular, etc.)

## License

MIT

## Author

Built with Claude Code
