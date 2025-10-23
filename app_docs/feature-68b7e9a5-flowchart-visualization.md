# SDLC Planner: Flowchart Visualization System

**ADW ID:** 68b7e9a5
**Date:** 2025-10-23
**Specification:** specs/issue-1-adw-68b7e9a5-sdlc_planner-flowchart-visualization.md

## Overview

Built an interactive flowchart visualization system that automatically generates visual representations of repository structure with git integration, version control history tracking, and threaded discussion context. The system provides a three-column interface where developers can see requirements, visualize code structure through draggable nodes, and track git history on a timeline.

## What Was Built

The implementation created a full-stack web application with:

- **Backend API (FastAPI + Python)**: Repository analysis, git integration, layout persistence
- **Frontend UI (React + TypeScript + ReactFlow)**: Interactive flowchart canvas with three-column layout
- **Code Parser**: AST-based Python parser to extract files, folders, functions, and classes
- **Git Integration**: Commit history tracking with file/function associations
- **Layout System**: YAML-based coordinate persistence with automatic position inference
- **Export Utilities**: Mermaid diagram and ASCII flowchart generators
- **Requirements Panel**: Markdown viewer for requirements and design decisions
- **Timeline Component**: Horizontal git history visualization with commit selection
- **Thread Reader**: Placeholder component for future Claude Code thread integration

## Technical Implementation

### Files Modified/Created

#### Backend (app/server/)
- `main.py`: FastAPI application with CORS and route registration
- `config.py`: Configuration management with CFG singleton
- `api/routes.py`: REST API endpoints for repo structure, git history, layout operations
- `core/repo_analyzer.py`: Directory traversal and file/folder extraction
- `core/code_parser.py`: Python AST parser for functions and classes
- `core/git_integration.py`: GitPython wrapper for commit history and branches
- `core/layout_manager.py`: YAML-based layout coordinate persistence
- `core/position_inference.py`: Hierarchical auto-layout algorithm
- `types.py`: Pydantic models for API schemas

#### Frontend (app/client/)
- `src/App.tsx`: Main three-column layout component
- `src/components/FlowCanvas.tsx`: ReactFlow canvas with custom node types
- `src/components/Timeline.tsx`: Git commit timeline with scrubbing
- `src/components/RequirementsPanel.tsx`: Markdown viewer for requirements
- `src/components/ThreadReader.tsx`: Thread display component (placeholder)
- `src/utils/api.ts`: API client with fetch wrappers
- `src/utils/mermaidGenerator.ts`: Mermaid diagram generator
- `src/utils/asciiRenderer.ts`: ASCII flowchart renderer
- `src/types/index.ts`: TypeScript type definitions

#### Configuration & Scripts
- `app/server/.env`: Environment configuration (API ports, repo path)
- `scripts/start_server.sh`: Launch FastAPI with uvicorn
- `scripts/start_client.sh`: Launch Vite dev server
- `app/README.md`: Application-level documentation

### Key Changes

1. **Repository Analysis Engine**: Implemented AST-based Python parser that extracts functions, classes, and their metadata (line numbers, parameters) from source files. The system walks the directory tree and creates a structured graph of files, folders, and code elements.

2. **Layout Persistence**: Created a dual-mode layout system where coordinates are stored separately from code structure in YAML files. When no layout exists, an automatic hierarchical inference algorithm positions nodes in a readable tree structure.

3. **Three-Column Architecture**: Built responsive grid layout (20%/60%/20%) with Requirements panel (left), interactive FlowCanvas (center), and Thread Reader (right). The center column includes action buttons for saving layout and exporting diagrams.

4. **Git Timeline Integration**: Integrated GitPython to extract commit history with file-level change tracking. The timeline component allows users to select commits and see which nodes were affected in that commit.

5. **Export Functionality**: Implemented two export formats:
   - Mermaid: Generates `.mmd` files with flowchart syntax for documentation
   - ASCII: Creates text-based flowcharts using box-drawing characters

## How to Use

### Starting the Application

1. **Install Backend Dependencies**
   ```bash
   cd app/server
   uv sync
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd app/client
   npm install
   ```

3. **Start the Backend Server**
   ```bash
   ./scripts/start_server.sh
   # Or: cd app/server && uv run uvicorn main:app --reload
   ```

4. **Start the Frontend Client**
   ```bash
   ./scripts/start_client.sh
   # Or: cd app/client && npm run dev
   ```

5. **Access the Application**
   - Open browser to `http://localhost:5173`
   - The backend API runs on `http://localhost:8001`

### Using the Interface

1. **View Repository Structure**: The center canvas displays nodes representing files, folders, functions, and classes from your repository. Edges show import dependencies.

2. **Reposition Nodes**: Drag any node to reposition it on the canvas. Use mouse wheel to zoom, click-drag background to pan.

3. **Save Layout**: Click the "Save Layout" button (top-right) to persist node positions to `layout.yaml`.

4. **Browse Requirements**: The left panel shows `requirements.md` and `design_decisions.md` content in collapsible sections.

5. **View Git History**: The timeline at the bottom shows commits chronologically. Click a commit to highlight affected nodes in the flowchart.

6. **Export Diagrams**:
   - **Mermaid**: Click "Export Mermaid" to download `.mmd` file for use in documentation
   - **ASCII**: Click "Export ASCII" to download `.txt` file with text-based flowchart

## Configuration

### Environment Variables (app/server/.env)

```env
# Repository to analyze
REPO_PATH=/Users/alex/Code3b/claude-agents-sdk

# API Configuration
API_HOST=127.0.0.1
API_PORT=8001

# Client Configuration
CLIENT_URL=http://localhost:5173
CLIENT_PORT=5173

# Layout File
LAYOUT_FILE=layout.yaml
```

### Customizing Repository Analysis

Edit `app/server/config.py` to change:
- Repository path
- File exclusion patterns (.git, __pycache__, node_modules)
- API port and CORS settings

## Testing

### Backend Tests

```bash
cd app/server
uv run pytest tests/
```

Tests cover:
- Repository analysis and file traversal
- AST parsing of Python files
- Git integration (commit history, branches)
- Layout manager (save/load YAML)
- Position inference algorithm
- API endpoints

### Frontend Type Checking

```bash
cd app/client
npm run build
```

Validates TypeScript types and builds production bundle.

### Manual E2E Verification

1. Start both server and client
2. Verify three-column layout renders correctly
3. Drag a node to new position
4. Click "Save Layout" and verify success message
5. Refresh page and verify node position persisted
6. Click a commit on timeline and verify affected nodes highlighted
7. Export Mermaid diagram and verify download

## Notes

### Technology Stack

- **Backend**: FastAPI, GitPython, PyYAML, Python AST
- **Frontend**: React, TypeScript, ReactFlow, TailwindCSS, Vite
- **Package Management**: uv (Python), npm (Node.js)

### Design Decisions

1. **Repo as Source of Truth**: Layout files store only X/Y coordinates, not node content. This ensures the flowchart always reflects current code state even as files change.

2. **Hierarchical Auto-Layout**: When no layout file exists, the system uses a simple hierarchical algorithm (folders at top, files below, functions at bottom) with vertical spacing to avoid overlaps.

3. **AST-Based Parsing**: Python's built-in `ast` module provides fast, accurate parsing for Python files. Future enhancements can add TreeSitter for multi-language support.

4. **Three-Column Layout**: Fixed 20/60/20 split provides context (requirements + threads) alongside visualization. Responsive design adapts to smaller screens.

### Current Limitations

- **Python Only**: Code parser currently only supports Python. JavaScript/TypeScript support requires TreeSitter integration.
- **No Thread Integration**: Thread reader is a placeholder component. Full Claude Code thread parsing not yet implemented.
- **Basic Layout Algorithm**: Auto-layout uses simple hierarchical positioning. Force-directed or advanced graph algorithms would improve readability for complex repos.
- **No Real-Time Collaboration**: Layout changes are local only. Multi-user editing would require WebSocket server.

### Future Enhancements

1. **Multi-Language Support**: Add TreeSitter parsers for JavaScript, TypeScript, Go, Rust, etc.
2. **Thread Integration**: Parse Claude Code ASL/JSONL exports and link prompts to commits/files
3. **Advanced Layout**: Implement force-directed or hierarchical Sugiyama layout algorithms
4. **Function Call Graphs**: Extract function call relationships (not just imports) to show execution flow
5. **Search & Filter**: Add full-text search across nodes, commits, and threads
6. **Export Formats**: PNG, SVG, PDF export using headless browser rendering
7. **Undo/Redo**: Track layout change history for easy experimentation

### Troubleshooting

**Issue**: Backend fails to start with "Port already in use"
- **Solution**: Change `API_PORT` in `.env` or kill process on port 8001

**Issue**: Frontend shows "Failed to load data" error
- **Solution**: Verify backend is running and `REPO_PATH` in `.env` points to valid git repository

**Issue**: Layout not persisting after save
- **Solution**: Check file permissions on `layout.yaml`. Backend needs write access to this file.

**Issue**: No nodes appear in flowchart
- **Solution**: Verify `REPO_PATH` contains Python files. Check backend logs for parsing errors.

**Issue**: Git timeline empty
- **Solution**: Verify repository at `REPO_PATH` is a git repository with commit history.

### Performance Considerations

- **Large Repositories**: For repos with >1000 files, consider implementing pagination or virtual scrolling in the future
- **Layout Save**: Debouncing on node drag would reduce excessive save operations
- **AST Parsing**: Parser caches results but doesn't persist cache. Future enhancement could use SQLite for caching parsed code structure

### Related Documentation

- **Specification**: `specs/issue-1-adw-68b7e9a5-sdlc_planner-flowchart-visualization.md` - Full feature specification with 31 tasks
- **Design Decisions**: `specs/design_decision_01_repo_as_source_of_truth.md` - Why layout files only store coordinates
- **Application README**: `app/README.md` - Quick start guide and architecture overview
- **Verification Report**: `VERIFICATION_REPORT.md` - Feature acceptance testing results
