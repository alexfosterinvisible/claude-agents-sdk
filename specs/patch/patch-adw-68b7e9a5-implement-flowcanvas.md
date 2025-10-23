# Patch: Implement FlowCanvas Component with ReactFlow

## Metadata
adw_id: `68b7e9a5`
review_change_request: `Issue #1: Frontend FlowCanvas component not implemented - shows 'Flowchart canvas coming soon...' instead of ReactFlow interactive canvas with nodes and edges Resolution: Implement FlowCanvas.tsx component using ReactFlow library to render nodes (files, folders, functions, classes) and edges (dependencies) with drag-and-drop functionality Severity: blocker`

## Issue Summary
**Original Spec:** specs/issue-1-adw-68b7e9a5-sdlc_planner-flowchart-visualization.md
**Issue:** The FlowCanvas component shows only a placeholder message "Flowchart canvas coming soon..." instead of rendering an interactive ReactFlow canvas with nodes and edges
**Solution:** Implement FlowCanvas.tsx component using the @xyflow/react library (already installed) to render an interactive flowchart with custom node types (File, Folder, Function, Class) and draggable functionality

## Files to Modify
Use these files to implement the patch:

1. **app/client/src/components/FlowCanvas.tsx** (create new file)
2. **app/client/src/components/nodes/FileNode.tsx** (create new file)
3. **app/client/src/components/nodes/FolderNode.tsx** (create new file)
4. **app/client/src/components/nodes/FunctionNode.tsx** (create new file)
5. **app/client/src/components/nodes/ClassNode.tsx** (create new file)
6. **app/client/src/types/index.ts** (create new file)
7. **app/client/src/utils/api.ts** (create new file)
8. **app/client/src/App.tsx** (modify)

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create TypeScript types for API integration
- Create `app/client/src/types/index.ts`
- Define interfaces matching backend Pydantic models: `Node`, `FileNode`, `FolderNode`, `FunctionNode`, `ClassNode`, `Edge`, `Position`, `Commit`
- Export all types for use across components

### Step 2: Create API client utilities
- Create `app/client/src/utils/api.ts`
- Implement `fetchRepoStructure(repoPath?: string): Promise<{nodes: Node[], edges: Edge[], root_path: string}>`
- Implement `fetchLayout(layoutFile?: string): Promise<Record<string, Position>>`
- Implement `inferLayout(repoPath?: string): Promise<Record<string, Position>>`
- Use `fetch` API with proper error handling and type safety

### Step 3: Create custom node components
- Create `app/client/src/components/nodes/` directory
- Implement `FileNode.tsx` with file icon, name display, and styled border
- Implement `FolderNode.tsx` with folder icon, name display, and distinctive styling
- Implement `FunctionNode.tsx` with function icon, name, parameters display
- Implement `ClassNode.tsx` with class icon, name, methods count
- Use TailwindCSS for consistent styling
- Each component should accept `data` prop with node metadata

### Step 4: Create FlowCanvas component
- Create `app/client/src/components/FlowCanvas.tsx`
- Import ReactFlow components from '@xyflow/react'
- Import custom node types (FileNode, FolderNode, FunctionNode, ClassNode)
- Define nodeTypes object mapping node type strings to components
- Accept props: `nodes`, `edges`, `onNodesChange`, `onEdgesChange`, `onNodeDragStop`
- Implement ReactFlow component with Background, Controls, MiniMap
- Configure drag-and-drop, zoom, and pan functionality
- Add proper TypeScript types for all props

### Step 5: Integrate FlowCanvas into App component
- Modify `app/client/src/App.tsx`
- Add state management for nodes, edges, positions using React hooks
- Implement data fetching on component mount: call `fetchRepoStructure()` and `fetchLayout()` or `inferLayout()`
- Transform API data into ReactFlow format (add x/y positions from layout)
- Replace placeholder "Flowchart canvas coming soon..." with `<FlowCanvas />` component
- Pass nodes, edges, and change handlers to FlowCanvas
- Add "Save Layout" button to capture and persist positions

### Step 6: Add ReactFlow styles
- Import '@xyflow/react/dist/style.css' in `app/client/src/main.tsx` or `App.tsx`
- Ensure ReactFlow canvas displays correctly with proper styling

## Validation
Execute every command to validate the patch is complete with zero regressions.

### Backend tests
```bash
cd app/server && uv run pytest -v
```
**Expected:** All backend tests pass (2/2 currently passing)

### Frontend build
```bash
cd app/client && npm run build
```
**Expected:** TypeScript compilation succeeds with no errors, Vite build completes successfully

### Frontend dev server
```bash
cd app/client && npm run dev
```
**Expected:** Dev server starts on port 5173 without errors

### Manual verification
1. Start backend: `cd app/server && uv run uvicorn main:app --reload`
2. Start frontend: `cd app/client && npm run dev`
3. Open browser to `http://localhost:5173`
4. **Verify:** FlowCanvas component renders instead of placeholder
5. **Verify:** Nodes are displayed on the canvas (may be from inferred positions if no layout file exists)
6. **Verify:** Nodes can be dragged and repositioned
7. **Verify:** Canvas supports zoom and pan controls
8. **Verify:** MiniMap shows overview of the flowchart
9. Take screenshot to document working implementation

## Patch Scope
**Lines of code to change:** ~400-500 lines (mostly new files)
**Risk level:** low (isolated frontend component, backend API already implemented)
**Testing required:** Manual verification of ReactFlow canvas rendering, drag-and-drop, and integration with backend API
