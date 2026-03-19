# Feature: Flow Chart Planning & Visualization System

## Metadata
issue_number: `1`
adw_id: `68b7e9a5`
issue_json: `{"number":1,"title":"Build Flow Chart Planning & Visualization System","body":"# Feature: Flow Chart Planning & Visualization System\n\n**Issue Type:** `/feature`\n**Priority:** High\n**ADW Workflow:** `adw_plan_build_iso`\n\n..."}`

## Feature Description
An interactive flowchart visualization system that automatically generates visual representations of repository structure (files, folders, functions, classes) with full git integration, version control history tracking, and multi-threaded context linking. The system will:

1. **Auto-generate flowchart nodes** from actual repo structure (files, folders, functions, classes parsed via AST)
2. **Store only coordinates/layout** in YAML/Mermaid files (repo structure is the source of truth)
3. **Provide visual canvas editor** with drag-and-drop for repositioning nodes
4. **Integrate git history** showing commits, branches, and PROMPT connections on a timeline
5. **Display three-column layout**: Requirements (left) | Flow Chart (center) | Chat Threads (right)
6. **Generate quick-reference outputs**: Mermaid diagrams and ASCII flowcharts from repo + coordinates
7. **Show dependency connections**: Imports, function calls, file relationships derived from actual code

This creates a living, interactive map of the codebase that evolves with git history and links requirements → implementation → discussion threads in a single visual interface.

## User Story
As a developer working on complex projects
I want to visualize my codebase structure with git history and context threads
So that I can understand relationships between files/functions/commits and track how features evolved over time

## Problem Statement
Current development workflows lack integrated visualization that:
- Connects code structure to git history to discussion context
- Shows actual dependency graphs derived from code analysis
- Links requirements documentation to implementation artifacts
- Provides both high-level overview and detailed drill-down capability
- Persists custom layout preferences while maintaining sync with evolving code

Developers spend significant time mentally mapping how files relate, which commits affected which functions, and what context led to specific design decisions. This information exists but is scattered across git logs, code comments, and chat histories.

## Solution Statement
Build a web-based interactive flowchart system that:

1. **Analyzes repository structure** using AST parsing (Python) and TreeSitter (multi-language) to extract files, folders, functions, and classes as nodes
2. **Stores only layout coordinates** in a separate YAML/Mermaid file, treating the repo itself as the source of truth for node content
3. **Provides visual canvas** (ReactFlow) for dragging/positioning nodes with real-time updates
4. **Auto-infers initial positions** algorithmically when no layout file exists
5. **Integrates git history** via GitPython to show commits on a draggable timeline
6. **Links git artifacts** (commits, branches, PRs) to specific files/functions they modified
7. **Displays three-column interface**: requirements.md (left), interactive flowchart (center), thread reader (right)
8. **Shows actual code dependencies** (imports, function calls) as visual connections between nodes
9. **Generates exportable outputs**: Mermaid diagrams and ASCII flowcharts for documentation/quick reference

Technology: FastAPI + Python backend (AST/TreeSitter, GitPython) | Vite + TypeScript + React frontend (ReactFlow, TailwindCSS)

## Relevant Files
Use these files to implement the feature:

### New Files to Create

#### Backend (Python + FastAPI + uv)
- **`app/server/main.py`** - FastAPI application entry point with CORS and route registration
- **`app/server/core/repo_analyzer.py`** - Walk directory tree, extract files/folders as nodes
- **`app/server/core/code_parser.py`** - AST parsing for Python, TreeSitter for JS/TS to extract functions/classes
- **`app/server/core/dependency_analyzer.py`** - Parse imports and function call graphs from code
- **`app/server/core/git_integration.py`** - GitPython wrapper for commit history, branches, blame data
- **`app/server/core/layout_manager.py`** - Load/save YAML/Mermaid coordinate files
- **`app/server/core/position_inference.py`** - Algorithm to auto-layout nodes when no coordinate file exists
- **`app/server/core/thread_parser.py`** - Parse Claude Code ASL/JSONL thread exports
- **`app/server/api/routes.py`** - REST API endpoints for flowchart data, git history, layout persistence
- **`app/server/config.py`** - Configuration singleton (CFG) for paths, git repo location, etc.
- **`app/server/types.py`** - Pydantic models for API request/response schemas

#### Frontend (Vite + TypeScript + React + ReactFlow)
- **`app/client/index.html`** - HTML entry point
- **`app/client/src/main.tsx`** - React application entry point
- **`app/client/src/App.tsx`** - Main application component with three-column layout
- **`app/client/src/components/FlowCanvas.tsx`** - ReactFlow canvas with nodes (files/functions) and edges (dependencies)
- **`app/client/src/components/Timeline.tsx`** - Horizontal draggable timeline showing git commits
- **`app/client/src/components/RequirementsPanel.tsx`** - Left panel displaying requirements.md and design_decisions.md
- **`app/client/src/components/ThreadReader.tsx`** - Right panel with collapsible/expandable thread navigation
- **`app/client/src/components/NodeEditor.tsx`** - Detail view for selected node (file/function metadata)
- **`app/client/src/utils/layoutParser.ts`** - Parse YAML/Mermaid coordinate files
- **`app/client/src/utils/mermaidGenerator.ts`** - Generate Mermaid diagram from repo structure + coordinates
- **`app/client/src/utils/asciiRenderer.ts`** - Generate ASCII flowchart from repo structure + coordinates
- **`app/client/src/types/index.ts`** - TypeScript type definitions for API responses
- **`app/client/src/styles/index.css`** - TailwindCSS styles
- **`app/client/vite.config.ts`** - Vite configuration
- **`app/client/tsconfig.json`** - TypeScript configuration
- **`app/client/package.json`** - Frontend dependencies (React, ReactFlow, TailwindCSS, etc.)

#### Scripts
- **`scripts/start_server.sh`** - Launch FastAPI server with uvicorn
- **`scripts/start_client.sh`** - Launch Vite dev server
- **`scripts/start_all.sh`** - Launch both server and client concurrently
- **`scripts/generate_mermaid.py`** - CLI script to generate Mermaid diagram from repo
- **`scripts/generate_ascii.py`** - CLI script to generate ASCII flowchart from repo

#### Configuration & Tests
- **`app/server/pyproject.toml`** - Python dependencies (FastAPI, GitPython, TreeSitter, PyYAML, uvicorn)
- **`app/server/tests/test_repo_analyzer.py`** - Unit tests for repo analysis
- **`app/server/tests/test_code_parser.py`** - Unit tests for AST/TreeSitter parsing
- **`app/server/tests/test_git_integration.py`** - Unit tests for git operations
- **`app/server/tests/test_layout_manager.py`** - Unit tests for layout persistence
- **`app/client/tests/FlowCanvas.test.tsx`** - Frontend component tests
- **`.env`** - Environment variables (repo path, git config, API port)
- **`justfile`** - Command shortcuts for running server, client, tests, etc.

#### Documentation
- **`app/README.md`** - Application-level documentation
- **`docs/ARCHITECTURE.md`** - System architecture and design decisions
- **`docs/API.md`** - REST API endpoint documentation

### Existing Files to Reference
- **`README.md`** - Project overview (to understand existing structure)
- **`ARCHITECTURE.md`** - Existing architecture patterns to follow
- **`scripts/`** - Existing script conventions
- **`.claude/commands/test_e2e.md`** - E2E testing framework (if creating UI tests)
- **`.claude/commands/e2e/test_basic_query.md`** - Example E2E test structure

## Implementation Plan

### Phase 1: Foundation
**Goal**: Set up project structure, backend framework, and core repository analysis capabilities

1. Create directory structure for `app/server/` and `app/client/`
2. Initialize FastAPI backend with basic configuration and CORS
3. Set up Python environment with `uv` and create `pyproject.toml` with dependencies:
   - FastAPI, uvicorn, GitPython, PyYAML, tree-sitter, tree-sitter-python, tree-sitter-javascript
4. Initialize Vite + React + TypeScript frontend with TailwindCSS
5. Create configuration management (`app/server/config.py`) with CFG singleton
6. Implement repo analyzer to walk directory tree and extract files/folders
7. Implement AST parser for Python to extract functions and classes
8. Add TreeSitter support for JavaScript/TypeScript parsing
9. Create basic Pydantic models for node types (FileNode, FolderNode, FunctionNode, ClassNode)

### Phase 2: Core Implementation
**Goal**: Build the interactive flowchart editor, layout persistence, and git integration

1. Implement layout manager to load/save YAML coordinate files
2. Create position inference algorithm for auto-layout when no coordinate file exists
3. Implement dependency analyzer to extract imports and function call graphs
4. Build git integration layer using GitPython (commit history, branches, blame)
5. Create REST API endpoints in `app/server/api/routes.py`:
   - `GET /api/repo/structure` - Return parsed repo nodes
   - `GET /api/repo/dependencies` - Return import/call graph edges
   - `GET /api/git/history` - Return commit history with file/function associations
   - `GET /api/layout` - Load layout coordinates
   - `POST /api/layout` - Save layout coordinates
6. Build ReactFlow canvas component (`FlowCanvas.tsx`) with drag-and-drop
7. Implement node rendering for files, folders, functions, classes
8. Add edge rendering for dependencies (imports, function calls)
9. Create layout persistence: save node positions to YAML on "Save" button click
10. Implement auto-layout trigger when no coordinate file exists

### Phase 3: Integration
**Goal**: Add timeline, requirements panel, thread reader, and complete three-column layout

1. Implement git timeline component (`Timeline.tsx`) with horizontal scrubber
2. Link timeline commits to flowchart nodes (highlight affected files/functions)
3. Build requirements panel (`RequirementsPanel.tsx`) to display requirements.md
4. Implement thread reader (`ThreadReader.tsx`) with collapsible/expandable navigation
5. Parse Claude Code ASL/JSONL thread format in `thread_parser.py`
6. Create three-column layout in `App.tsx`:
   - Left: 20% width (requirements)
   - Center: 60% width (flowchart)
   - Right: 20% width (threads)
7. Add dimmed connection lines between requirements → nodes → threads
8. Implement hover interactions: highlight connections when hovering over nodes
9. Create Mermaid generator utility (`mermaidGenerator.ts`)
10. Create ASCII renderer utility (`asciiRenderer.ts`)
11. Add export buttons for Mermaid and ASCII outputs

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Task 1: Project Structure & Backend Initialization
- Create `app/`, `app/server/`, `app/client/` directories
- Create `app/server/core/`, `app/server/api/`, `app/server/tests/` subdirectories
- Initialize Python project with `uv init` in `app/server/`
- Create `pyproject.toml` with dependencies: fastapi, uvicorn, gitpython, pyyaml, tree-sitter, tree-sitter-python, tree-sitter-javascript, pydantic
- Install dependencies with `cd app/server && uv sync`
- Create `app/server/config.py` with CFG singleton for configuration
- Create `app/server/types.py` with base Pydantic models
- Create `app/server/main.py` with basic FastAPI app, CORS configuration
- Write unit test `app/server/tests/test_main.py` to verify FastAPI launches

### Task 2: Repository Structure Analysis
- Create `app/server/core/repo_analyzer.py`:
  - Implement `analyze_repo(repo_path: str) -> RepoStructure` function
  - Walk directory tree using `os.walk` or `pathlib.Path.rglob`
  - Extract files and folders as nodes with metadata (path, name, type)
  - Return structured data (list of FileNode, FolderNode)
- Write unit test `app/server/tests/test_repo_analyzer.py`:
  - Test on sample directory with known structure
  - Verify correct file/folder extraction
  - Test edge cases (symlinks, hidden files, .git directory exclusion)

### Task 3: Code Parsing (AST for Python)
- Create `app/server/core/code_parser.py`:
  - Implement `parse_python_file(file_path: str) -> List[CodeNode]` using Python `ast` module
  - Extract function definitions (name, parameters, line numbers)
  - Extract class definitions (name, methods, line numbers)
  - Handle parsing errors gracefully
- Add Pydantic models in `types.py`: `FunctionNode`, `ClassNode`, `MethodNode`
- Write unit test `app/server/tests/test_code_parser.py`:
  - Test parsing sample Python file with functions and classes
  - Verify correct extraction of names, parameters, line numbers
  - Test error handling for malformed Python files

### Task 4: Multi-Language Support (TreeSitter)
- Extend `app/server/core/code_parser.py`:
  - Implement `parse_javascript_file(file_path: str)` using TreeSitter
  - Implement `parse_typescript_file(file_path: str)` using TreeSitter
  - Extract functions and classes from JS/TS files
  - Use TreeSitter queries for parsing
- Install TreeSitter language parsers: `uv add tree-sitter-javascript tree-sitter-typescript`
- Write unit test `app/server/tests/test_code_parser.py`:
  - Test JS/TS parsing with sample files
  - Verify function/class extraction works

### Task 5: Dependency Analysis
- Create `app/server/core/dependency_analyzer.py`:
  - Implement `analyze_imports(file_path: str) -> List[ImportEdge]` for Python
  - Parse `import` and `from ... import` statements using AST
  - Implement similar logic for JS/TS using TreeSitter
  - Return list of edges: source_file → target_file
- Add Pydantic model `ImportEdge(source: str, target: str, import_name: str)`
- Write unit test `app/server/tests/test_dependency_analyzer.py`:
  - Test on files with known imports
  - Verify correct edge extraction

### Task 6: Git Integration
- Create `app/server/core/git_integration.py`:
  - Implement `get_commit_history(repo_path: str) -> List[Commit]` using GitPython
  - Extract commit hash, author, date, message, files changed
  - Implement `get_branches(repo_path: str) -> List[Branch]`
  - Implement `get_file_blame(repo_path: str, file_path: str) -> Dict[int, Commit]`
  - Map line numbers to commits for function-level tracking
- Add Pydantic models: `Commit`, `Branch`, `FileChange`
- Write unit test `app/server/tests/test_git_integration.py`:
  - Test on sample git repo (can use test fixtures)
  - Verify commit history extraction
  - Test git blame functionality

### Task 7: Layout Manager
- Create `app/server/core/layout_manager.py`:
  - Implement `load_layout(layout_file: str) -> Dict[str, Position]` to read YAML
  - Implement `save_layout(layout_file: str, positions: Dict[str, Position])` to write YAML
  - Use PyYAML for serialization
  - Format: `{node_id: {x: float, y: float}}`
- Add Pydantic model `Position(x: float, y: float)`
- Write unit test `app/server/tests/test_layout_manager.py`:
  - Test round-trip: save → load → verify same data
  - Test handling of missing layout file

### Task 8: Position Inference Algorithm
- Create `app/server/core/position_inference.py`:
  - Implement `infer_positions(nodes: List[Node], edges: List[Edge]) -> Dict[str, Position]`
  - Use hierarchical layout algorithm (folders at top, files below, functions at bottom)
  - Simple grid layout with vertical spacing for hierarchy
  - Return computed positions as dict
- Write unit test `app/server/tests/test_position_inference.py`:
  - Test on sample node/edge graph
  - Verify no overlapping nodes
  - Verify hierarchy preserved (folders → files → functions)

### Task 9: Thread Parser
- Create `app/server/core/thread_parser.py`:
  - Implement `parse_asl_thread(thread_file: str) -> ThreadData`
  - Parse JSONL format (Claude Code ASL export)
  - Extract messages, timestamps, tool uses
- Add Pydantic models: `ThreadData`, `ThreadMessage`
- Write unit test `app/server/tests/test_thread_parser.py`:
  - Test on sample ASL/JSONL file
  - Verify correct parsing

### Task 10: REST API Endpoints
- Create `app/server/api/routes.py`:
  - `GET /api/repo/structure?path={repo_path}`:
    - Call repo_analyzer, code_parser
    - Return list of all nodes (files, folders, functions, classes)
  - `GET /api/repo/dependencies?path={repo_path}`:
    - Call dependency_analyzer
    - Return list of edges (imports, calls)
  - `GET /api/git/history?path={repo_path}`:
    - Call git_integration
    - Return commit history with file associations
  - `GET /api/layout?file={layout_file}`:
    - Call layout_manager.load_layout
    - Return coordinate dict
  - `POST /api/layout?file={layout_file}`:
    - Accept coordinate dict in request body
    - Call layout_manager.save_layout
  - `GET /api/threads?file={thread_file}`:
    - Call thread_parser
    - Return parsed thread data
- Register routes in `main.py`
- Write integration test `app/server/tests/test_api.py`:
  - Use FastAPI TestClient
  - Test each endpoint with sample data

### Task 11: Frontend Initialization
- Initialize Vite project: `cd app/client && npm create vite@latest . -- --template react-ts`
- Install dependencies: `npm install react-flow-renderer tailwindcss autoprefixer postcss`
- Set up TailwindCSS: `npx tailwindcss init -p`
- Configure `tailwind.config.js` for content paths
- Create `app/client/src/styles/index.css` with Tailwind directives
- Create `app/client/tsconfig.json` with strict TypeScript settings
- Create `app/client/vite.config.ts` with proxy to backend API (port 8000)

### Task 12: TypeScript Types for API
- Create `app/client/src/types/index.ts`:
  - Define interfaces matching backend Pydantic models:
    - `Node`, `FileNode`, `FolderNode`, `FunctionNode`, `ClassNode`
    - `Edge`, `ImportEdge`, `CallEdge`
    - `Commit`, `Branch`, `Position`
    - `ThreadData`, `ThreadMessage`
  - Export all types

### Task 13: API Client Utilities
- Create `app/client/src/utils/api.ts`:
  - Implement `fetchRepoStructure(repoPath: string): Promise<Node[]>`
  - Implement `fetchDependencies(repoPath: string): Promise<Edge[]>`
  - Implement `fetchGitHistory(repoPath: string): Promise<Commit[]>`
  - Implement `fetchLayout(layoutFile: string): Promise<Record<string, Position>>`
  - Implement `saveLayout(layoutFile: string, positions: Record<string, Position>): Promise<void>`
  - Use `fetch` API with error handling

### Task 14: FlowCanvas Component
- Create `app/client/src/components/FlowCanvas.tsx`:
  - Use ReactFlow library
  - Accept props: `nodes: Node[]`, `edges: Edge[]`, `onNodesChange`, `onEdgesChange`
  - Render custom node types for File, Folder, Function, Class
  - Enable drag-and-drop for repositioning
  - Add zoom and pan controls
  - Emit position updates on node drag end
- Create custom node components:
  - `FileNodeComponent.tsx`
  - `FolderNodeComponent.tsx`
  - `FunctionNodeComponent.tsx`
  - `ClassNodeComponent.tsx`
- Style with TailwindCSS

### Task 15: Timeline Component
- Create `app/client/src/components/Timeline.tsx`:
  - Display horizontal scrollable timeline
  - Accept props: `commits: Commit[]`, `onCommitSelect: (commit: Commit) => void`
  - Render commit markers with author, date, message tooltip
  - Implement draggable scrubber to navigate timeline
  - Highlight selected commit
- Style with TailwindCSS

### Task 16: Requirements Panel
- Create `app/client/src/components/RequirementsPanel.tsx`:
  - Accept props: `requirementsContent: string`, `designDecisionsContent: string`
  - Render markdown content in collapsible sections
  - Use markdown parser (install `react-markdown`)
  - Add scrollable container
- Style with TailwindCSS

### Task 17: Thread Reader Component
- Create `app/client/src/components/ThreadReader.tsx`:
  - Accept props: `thread: ThreadData`
  - Render nested collapsible/expandable message tree
  - Display timestamps, authors, content
  - Implement fold/unfold logic for long messages
  - Add search/filter capability
- Style with TailwindCSS

### Task 18: Node Editor Component
- Create `app/client/src/components/NodeEditor.tsx`:
  - Accept props: `selectedNode: Node | null`
  - Display detailed metadata (path, line numbers, git blame)
  - Show related commits
  - Show related threads
  - Add "Go to code" button
- Style with TailwindCSS

### Task 19: Main App Component (Three-Column Layout)
- Create `app/client/src/App.tsx`:
  - Implement three-column layout using CSS Grid:
    - Left column (20%): RequirementsPanel
    - Center column (60%): FlowCanvas + Timeline (stacked vertically)
    - Right column (20%): ThreadReader
  - Fetch data on mount: repo structure, dependencies, git history, layout
  - Manage state with React hooks (useState, useEffect)
  - Handle layout save: collect node positions, call saveLayout API
  - Add "Save Layout" button
  - Add "Export Mermaid" button
  - Add "Export ASCII" button
- Implement responsive behavior for smaller screens

### Task 20: Layout Persistence Integration
- In `App.tsx`, implement layout save logic:
  - On "Save" button click, collect all node positions from ReactFlow
  - Call `saveLayout` API with current positions
  - Show success/error toast notification
- On initial load:
  - Check if layout file exists (call `fetchLayout`)
  - If exists, apply positions to nodes
  - If not exists, call backend position inference API (create endpoint if needed)
  - Apply inferred positions to nodes

### Task 21: Mermaid Generator
- Create `app/client/src/utils/mermaidGenerator.ts`:
  - Implement `generateMermaid(nodes: Node[], edges: Edge[], positions: Record<string, Position>): string`
  - Generate Mermaid flowchart syntax from node/edge data
  - Use saved positions to inform layout hints (if Mermaid supports)
  - Return string ready for rendering or export
- Add button in `App.tsx` to trigger generation and download as `.mmd` file

### Task 22: ASCII Renderer
- Create `app/client/src/utils/asciiRenderer.ts`:
  - Implement `generateASCII(nodes: Node[], edges: Edge[], positions: Record<string, Position>): string`
  - Generate ASCII art flowchart using box-drawing characters
  - Use saved positions to determine spatial layout
  - Return string ready for display or export
- Add button in `App.tsx` to trigger generation and display in modal or download as `.txt` file

### Task 23: Connection Highlighting
- In `FlowCanvas.tsx`, implement hover interactions:
  - On node hover, identify connected edges (imports, calls, requirements, threads)
  - Highlight connected edges by changing color/opacity
  - Dim non-connected edges
  - Show tooltip with connection details
- In `App.tsx`, implement cross-component highlighting:
  - When hovering node, highlight related items in RequirementsPanel and ThreadReader
  - Use shared state or event bus for coordination

### Task 24: Git Commit Linkage
- Extend `Timeline.tsx`:
  - On commit selection, emit event to highlight affected nodes in FlowCanvas
  - Show which files/functions were modified in that commit
- In `FlowCanvas.tsx`:
  - Accept `selectedCommit` prop
  - Highlight nodes affected by selected commit (change border color)
  - Add visual indicator (e.g., commit hash badge on node)

### Task 25: Scripts for Launching Application
- Create `scripts/start_server.sh`:
  ```bash
  #!/bin/bash
  cd app/server
  uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```
- Create `scripts/start_client.sh`:
  ```bash
  #!/bin/bash
  cd app/client
  npm run dev
  ```
- Create `scripts/start_all.sh`:
  ```bash
  #!/bin/bash
  ./scripts/start_server.sh &
  ./scripts/start_client.sh &
  wait
  ```
- Make scripts executable: `chmod +x scripts/*.sh`

### Task 26: CLI Scripts for Export
- Create `scripts/generate_mermaid.py`:
  - CLI script that calls repo_analyzer, code_parser, layout_manager
  - Generates Mermaid diagram and prints to stdout or saves to file
  - Usage: `python scripts/generate_mermaid.py --repo ./my_project --layout ./layout.yaml --output diagram.mmd`
- Create `scripts/generate_ascii.py`:
  - Similar to above, generates ASCII flowchart
  - Usage: `python scripts/generate_ascii.py --repo ./my_project --layout ./layout.yaml --output diagram.txt`
- Add argument parsing with `argparse`
- Write tests or manual verification

### Task 27: Environment Configuration
- Create `.env` file in project root:
  ```
  REPO_PATH=/path/to/target/repo
  LAYOUT_FILE=/path/to/layout.yaml
  API_PORT=8000
  CLIENT_PORT=5173
  ```
- Update `app/server/config.py` to load from `.env` using `python-dotenv`
- Add `.env` to `.gitignore`

### Task 28: Documentation
- Create `app/README.md`:
  - Overview of the flowchart system
  - Installation instructions
  - Usage guide (starting server, client, using UI)
  - API endpoint documentation reference
- Create `docs/ARCHITECTURE.md`:
  - System architecture diagram
  - Component descriptions
  - Data flow diagrams
  - Technology choices and rationale
- Create `docs/API.md`:
  - Detailed REST API documentation
  - Request/response examples for each endpoint
  - Error codes and handling

### Task 29: Justfile for Commands
- Create `justfile` in project root:
  ```justfile
  # Flow Chart Planning & Visualization System commands

  # Start backend server
  server:
      ./scripts/start_server.sh

  # Start frontend client
  client:
      ./scripts/start_client.sh

  # Start both server and client
  start:
      ./scripts/start_all.sh

  # Run backend tests
  test-server:
      cd app/server && uv run pytest

  # Run frontend build
  build-client:
      cd app/client && npm run build

  # Generate Mermaid diagram
  mermaid repo layout output:
      python scripts/generate_mermaid.py --repo {{repo}} --layout {{layout}} --output {{output}}

  # Generate ASCII flowchart
  ascii repo layout output:
      python scripts/generate_ascii.py --repo {{repo}} --layout {{layout}} --output {{output}}
  ```

### Task 30: E2E Test Creation (if UI testing required)
- Read `.claude/commands/test_e2e.md` to understand E2E test framework
- Read `.claude/commands/e2e/test_basic_query.md` for example structure
- Create `.claude/commands/e2e/test_flowchart_visualization.md`:
  - **Test Goal**: Verify flowchart system displays repo structure, allows node repositioning, and saves layout
  - **Steps**:
    1. Start server and client
    2. Navigate to `http://localhost:5173`
    3. Verify three-column layout renders
    4. Verify center panel shows flowchart with nodes from test repo
    5. Drag a file node to new position
    6. Click "Save Layout" button
    7. Verify success notification appears
    8. Refresh page
    9. Verify node is still in new position (layout persisted)
    10. Select a commit on timeline
    11. Verify affected nodes are highlighted
    12. Click "Export Mermaid" button
    13. Verify Mermaid file downloads
    14. Take screenshot of full interface
  - **Expected Results**: All steps pass, screenshot shows working three-column interface with flowchart

### Task 31: Run Validation Commands
- Execute all validation commands from the "Validation Commands" section below
- Fix any errors encountered
- Ensure all tests pass with zero regressions
- Verify E2E test passes if created

## Testing Strategy

### Unit Tests

#### Backend Unit Tests (`app/server/tests/`)
- **`test_repo_analyzer.py`**:
  - Test directory traversal on sample repo structure
  - Verify files and folders extracted correctly
  - Test exclusion of `.git`, `__pycache__`, `.venv` directories
  - Test handling of symlinks and edge cases

- **`test_code_parser.py`**:
  - Test Python AST parsing on sample `.py` files
  - Test JavaScript TreeSitter parsing on sample `.js` files
  - Test TypeScript TreeSitter parsing on sample `.ts` files
  - Verify function names, class names, line numbers extracted
  - Test error handling for malformed code files

- **`test_dependency_analyzer.py`**:
  - Test import extraction from Python files
  - Test import extraction from JS/TS files
  - Verify edges created correctly (source → target)
  - Test relative and absolute imports

- **`test_git_integration.py`**:
  - Test commit history extraction (use test git repo)
  - Test branch listing
  - Test git blame functionality
  - Verify commit metadata (hash, author, date, message)

- **`test_layout_manager.py`**:
  - Test YAML load/save round-trip
  - Test handling of missing layout file
  - Test handling of malformed YAML

- **`test_position_inference.py`**:
  - Test auto-layout algorithm on sample node graph
  - Verify no overlapping positions
  - Verify hierarchical structure preserved

- **`test_thread_parser.py`**:
  - Test JSONL parsing on sample ASL thread file
  - Verify messages, timestamps, tool uses extracted

- **`test_api.py`**:
  - Integration tests using FastAPI TestClient
  - Test each REST endpoint with sample data
  - Verify response schemas match Pydantic models
  - Test error cases (invalid paths, missing files)

#### Frontend Unit Tests (`app/client/tests/`)
- **`FlowCanvas.test.tsx`**:
  - Test node rendering with sample data
  - Test drag-and-drop position updates
  - Test edge rendering
  - Test zoom/pan controls

- **`Timeline.test.tsx`**:
  - Test commit rendering with sample data
  - Test commit selection emits correct event
  - Test timeline scrubbing

### Edge Cases
1. **Empty repository**: No files or folders → display empty canvas with message
2. **No git history**: Repository not initialized with git → disable timeline, show warning
3. **Large repository**: Thousands of files → implement pagination or virtual scrolling
4. **Malformed layout file**: YAML parse error → fall back to auto-inferred positions
5. **Missing dependencies**: Import to non-existent file → show broken edge with warning indicator
6. **Cyclic dependencies**: A imports B, B imports A → detect and visualize cycle
7. **No layout file exists**: First-time use → auto-infer positions, prompt user to save layout
8. **Concurrent saves**: Multiple users saving layout → last write wins (or implement conflict resolution)
9. **Special characters in filenames**: Unicode, spaces, etc. → ensure proper escaping in YAML
10. **Very large files**: Parse timeout → implement timeout and partial parsing with warning

## Acceptance Criteria

### Must Have (MVP):
1. ✅ Backend can analyze repository structure and extract files, folders, functions, classes from Python code
2. ✅ Backend can parse git history and return commit list with file associations
3. ✅ Backend can load/save layout coordinates to/from YAML file
4. ✅ Backend can auto-infer initial positions when no layout file exists
5. ✅ Frontend displays three-column layout: requirements | flowchart | threads
6. ✅ FlowCanvas renders nodes for files, folders, functions, classes
7. ✅ FlowCanvas renders edges for import dependencies
8. ✅ Nodes can be dragged to reposition on canvas
9. ✅ "Save Layout" button persists node positions to backend
10. ✅ On page load, layout is restored from saved coordinates
11. ✅ Timeline displays git commits chronologically
12. ✅ Selecting commit on timeline highlights affected nodes in flowchart
13. ✅ Mermaid diagram can be generated and exported from UI
14. ✅ All backend unit tests pass
15. ✅ All frontend tests pass
16. ✅ Application can be started with `just start` command

### Should Have:
1. ASCII flowchart generation and export
2. TreeSitter parsing for JavaScript and TypeScript (in addition to Python)
3. Function call graph edges (in addition to import edges)
4. RequirementsPanel displays requirements.md and design_decisions.md
5. ThreadReader displays parsed Claude Code ASL threads
6. Hover over node highlights connected edges and related items in side panels
7. Git blame data shown in NodeEditor for selected node
8. Responsive layout for different screen sizes

### Nice to Have:
1. Multi-level summarization (Haiku 4.5) for thread reader
2. Dimmed connection lines that light up on hover
3. Draggable timeline scrubber with zoom
4. Real-time collaboration (multiple users editing layout)
5. Export to PNG/SVG/PDF formats
6. Advanced graph layout algorithms (force-directed, hierarchical)
7. Search/filter functionality for nodes and commits
8. Undo/redo for layout changes

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

### Backend Validation
```bash
cd app/server && uv run pytest
```
**Expected**: All backend unit tests pass (repo_analyzer, code_parser, dependency_analyzer, git_integration, layout_manager, position_inference, thread_parser, API tests)

### Frontend Type Check
```bash
cd app/client && npm run build
```
**Expected**: TypeScript compilation succeeds with no errors

### Frontend Build
```bash
cd app/client && npm run build
```
**Expected**: Vite build completes successfully, produces `dist/` folder

### Manual Verification (E2E)
1. Start backend: `just server` (or `./scripts/start_server.sh`)
2. Start frontend: `just client` (or `./scripts/start_client.sh`)
3. Open browser to `http://localhost:5173`
4. Verify three-column layout displays
5. Verify flowchart shows nodes from test repository
6. Drag a node to new position
7. Click "Save Layout" button → verify success message
8. Refresh page → verify node position persisted
9. Click a commit on timeline → verify affected nodes highlighted
10. Click "Export Mermaid" → verify download starts
11. Take screenshot to document working system

### CLI Script Validation
```bash
python scripts/generate_mermaid.py --repo ./app/server --layout ./test_layout.yaml --output test_diagram.mmd
cat test_diagram.mmd
```
**Expected**: Mermaid diagram file generated with valid syntax

```bash
python scripts/generate_ascii.py --repo ./app/server --layout ./test_layout.yaml --output test_diagram.txt
cat test_diagram.txt
```
**Expected**: ASCII flowchart file generated with visual representation

### E2E Test Validation (if created)
1. Read `.claude/commands/test_e2e.md` for instructions on running E2E tests
2. Execute the E2E test defined in `.claude/commands/e2e/test_flowchart_visualization.md`
3. Verify all steps pass successfully
4. Review screenshots captured during test

## Notes

### Technology Choices
- **FastAPI + uvicorn**: Modern async Python framework, easy to set up, great for REST APIs
- **GitPython**: Battle-tested library for git operations, comprehensive feature set
- **TreeSitter**: Industry-standard multi-language parser, faster and more accurate than regex
- **ReactFlow**: Purpose-built for node-based UI, handles drag-and-drop, edges, zooming out of the box
- **TailwindCSS**: Utility-first CSS, rapid styling, consistent design system
- **PyYAML**: Standard YAML parser for Python, simple coordinate storage format
- **Vite**: Fast development server, modern tooling, excellent TypeScript support

### Design Decisions
1. **Repo as source of truth**: Layout file stores ONLY coordinates, not node content. This ensures flowchart always reflects current code state.
2. **Auto-inference fallback**: When no layout file exists, algorithm generates reasonable initial positions. User can then refine and save.
3. **Git history over database**: Initially use git log for version tracking. SQLite can be added later for caching if performance requires.
4. **Three-column layout**: Matches original vision, provides context (requirements + threads) alongside visualization.
5. **AST + TreeSitter**: AST for Python (built-in, fast), TreeSitter for JS/TS (multi-language support, robust).

### Future Enhancements
1. **Multi-level summarization**: Use Haiku 4.5 API to pre-generate summaries at 1-3 nesting levels for thread reader
2. **Advanced layout algorithms**: Implement force-directed or hierarchical algorithms for better auto-layout
3. **Real-time collaboration**: Use WebSockets for multi-user editing with conflict resolution
4. **Timeline animations**: Animate flowchart as timeline is scrubbed, showing code evolution
5. **Prompt tracking**: Parse Claude Code session logs to link specific prompts to commits/files
6. **Export formats**: Add PNG/SVG/PDF export using headless browser or server-side rendering
7. **Search and filter**: Add full-text search across nodes, commits, threads

### Development Workflow
- Commit regularly using `<feat>`, `<fix>` tags
- Run tests after each component implementation
- Use justfile commands for consistency
- Update CLAUDE.md if new patterns emerge
- Keep `.env` file up-to-date with configuration

### Dependencies to Add (via `uv add`)
Backend (`cd app/server && uv add <package>`):
- fastapi
- uvicorn[standard]
- gitpython
- pyyaml
- tree-sitter
- tree-sitter-python
- tree-sitter-javascript
- pydantic
- python-dotenv
- pytest (dev)
- pytest-asyncio (dev)
- httpx (dev, for TestClient)

Frontend (`cd app/client && npm install <package>`):
- react
- react-dom
- react-flow-renderer (or @xyflow/react for latest)
- tailwindcss
- autoprefixer
- postcss
- react-markdown
- typescript
- @types/react
- @types/react-dom
- vite

### Performance Considerations
- For large repos (>1000 files), implement pagination or lazy loading of nodes
- Cache parsed code structure to avoid re-parsing on every request
- Use debouncing for layout save to avoid excessive writes during drag operations
- Consider web workers for heavy parsing on frontend (Mermaid/ASCII generation)

### Security Considerations
- Validate repo paths to prevent directory traversal attacks
- Sanitize file paths before git operations
- Use CORS configuration to restrict API access
- Never expose `.env` file or git credentials
- Validate YAML input to prevent code injection
