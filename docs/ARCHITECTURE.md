# SDLC Planner Architecture

## System Overview

SDLC Planner is a flowchart visualization system for repository structure with git integration. It consists of a FastAPI backend for code analysis and git operations, designed to support a React frontend (future implementation).

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      SDLC Planner System                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────┐         ┌──────────────────────┐       │
│  │   FastAPI     │◄────────┤  Git Repository      │       │
│  │   Backend     │         │  (Target for         │       │
│  │   (Port 8000) │         │   Analysis)          │       │
│  └───────┬───────┘         └──────────────────────┘       │
│          │                                                  │
│          │                                                  │
│  ┌───────▼────────────────────────────────────────┐       │
│  │           Core Analysis Modules                 │       │
│  │  • repo_analyzer    - Directory traversal       │       │
│  │  • code_parser      - AST/TreeSitter parsing    │       │
│  │  • dependency_analyzer - Import extraction      │       │
│  │  • git_integration  - Commit history & blame    │       │
│  │  • layout_manager   - YAML persistence          │       │
│  │  • position_inference - Auto-layout             │       │
│  │  • thread_parser    - Claude Code threads       │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │              REST API Endpoints                  │       │
│  │  /api/repo/structure    - Node extraction        │       │
│  │  /api/repo/dependencies - Import edges           │       │
│  │  /api/git/history       - Commit timeline        │       │
│  │  /api/layout            - Layout CRUD            │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components

### Backend (Python)

**Technology Stack:**
- FastAPI 0.119+
- Python 3.12+
- GitPython 3.1+
- TreeSitter 0.25+
- PyYAML 6.0+

**Core Modules:**

1. **repo_analyzer.py**
   - Walks directory tree
   - Extracts files and folders as nodes
   - Excludes common directories (.git, __pycache__, etc.)
   - Returns RepoStructure with nodes and edges

2. **code_parser.py**
   - Python: Uses `ast` module for parsing
   - JS/TS: Uses TreeSitter for parsing
   - Extracts functions, classes, methods with line numbers
   - Returns list of code nodes

3. **dependency_analyzer.py**
   - Parses import statements
   - Creates edges between files
   - Supports Python and JS/TS import syntax
   - Returns ImportEdge objects

4. **git_integration.py**
   - Wraps GitPython for repository operations
   - Extracts commit history with file associations
   - Provides git blame data for files
   - Returns Commit, Branch, BlameLine objects

5. **layout_manager.py**
   - Loads/saves node positions to YAML
   - Format: `{node_id: {x: float, y: float}}`
   - Handles missing layout files gracefully

6. **position_inference.py**
   - Auto-generates initial positions
   - Uses hierarchical layout algorithm
   - Layers: folders → files → classes → functions → methods
   - Grid-based spacing to avoid overlaps

7. **thread_parser.py**
   - Parses Claude Code ASL/JSONL threads
   - Extracts messages, timestamps, tool uses
   - Returns ThreadData with message list

### Data Models (models.py)

**Pydantic Models:**
- `BaseNode` - Base class for all nodes
- `FileNode`, `FolderNode` - Repository structure
- `FunctionNode`, `ClassNode`, `MethodNode` - Code elements
- `Edge`, `ImportEdge`, `CallEdge` - Connections
- `Commit`, `Branch`, `BlameLine` - Git data
- `Position`, `LayoutData` - Layout information
- `ThreadData`, `ThreadMessage` - Thread information

### Configuration (config.py)

**CFG Singleton:**
- `repo_path` - Target repository to analyze
- `layout_file` - YAML file for layout persistence
- `api_host`, `api_port` - Server configuration
- `exclude_dirs` - Directories to skip during analysis

## Data Flow

### Repository Analysis Flow

```
1. Client requests /api/repo/structure?path={repo}
2. repo_analyzer walks directory tree
3. For each code file (.py, .js, .ts):
   a. code_parser extracts functions/classes
   b. dependency_analyzer extracts imports
4. Combine all nodes and edges
5. Return as JSON
```

### Layout Management Flow

```
1. Client loads layout: GET /api/layout?file={file}
2. If file exists: load positions from YAML
3. If file missing: generate positions with position_inference
4. Client displays nodes at positions
5. User drags nodes to new positions
6. Client saves: POST /api/layout with new positions
7. Backend writes to YAML file
```

### Git Integration Flow

```
1. Client requests /api/git/history?path={repo}
2. git_integration.get_commit_history() called
3. GitPython iterates commits
4. For each commit:
   a. Extract metadata (hash, author, date, message)
   b. Compute diff to get files_changed
5. Return list of Commit objects as JSON
```

## Technology Choices

### Why FastAPI?
- Modern async Python framework
- Automatic OpenAPI documentation
- Type validation with Pydantic
- Fast development and deployment

### Why GitPython?
- Mature, well-tested library
- Comprehensive git operations
- Pythonic API
- No external git binary required

### Why TreeSitter?
- Multi-language support
- Fast, incremental parsing
- Industry standard (used by GitHub, Neovim, etc.)
- More accurate than regex-based parsing

### Why YAML for Layout?
- Human-readable format
- Simple key-value structure
- Easy to hand-edit if needed
- Minimal overhead for coordinates

## Future Enhancements

1. **Frontend Implementation**
   - React + TypeScript + ReactFlow
   - Three-column layout: requirements | flowchart | threads
   - Drag-and-drop node positioning

2. **Advanced Layouts**
   - Force-directed algorithms
   - Hierarchical tree layouts
   - Circular layouts

3. **Real-time Collaboration**
   - WebSocket support
   - Multi-user editing
   - Conflict resolution

4. **Export Formats**
   - Mermaid diagrams (CLI implemented)
   - ASCII flowcharts (CLI implemented)
   - PNG/SVG/PDF (future)

5. **Performance Optimization**
   - Caching parsed results
   - Pagination for large repos
   - Background processing

## Design Decisions

1. **Repo as Source of Truth**: Layout file stores only coordinates, not node content. This ensures flowchart always reflects current code state.

2. **Separation of Concerns**: Core logic (analysis, parsing, git) separated from API layer for easier testing and reuse.

3. **Extensible Parsing**: Plugin architecture allows adding new language parsers without modifying core code.

4. **Git-First**: Git history is primary version control mechanism, not a separate database.

5. **YAML over JSON**: YAML chosen for layouts because it's more human-readable and easier to hand-edit.

## Error Handling

- Missing repository: Return 500 with error message
- Invalid git repository: Return 500 with error message
- Parse errors: Skip file, continue with others
- Missing layout file: Auto-generate positions
- Malformed YAML: Return empty positions dict

## Security Considerations

- Validate repository paths to prevent directory traversal
- Sanitize file paths before git operations
- CORS configured for specific client origins
- No authentication required for local use
- Do not expose .env file or credentials

## Performance Considerations

- Large repositories (>1000 files): Consider pagination
- Caching: Store parsed results to avoid re-parsing
- Debouncing: Avoid excessive layout saves during drag operations
- Lazy loading: Load code nodes on-demand, not upfront
