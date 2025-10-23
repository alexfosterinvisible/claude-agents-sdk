# Patch: Add Export Functionality for Mermaid and ASCII Flowcharts

## Metadata
adw_id: `68b7e9a5`
review_change_request: `Issue #6: Export functionality not implemented - no buttons or logic for Mermaid diagram export or ASCII flowchart generation Resolution: Add export buttons in App.tsx and implement mermaidGenerator.ts and asciiRenderer.ts utilities to generate and download diagram files Severity: blocker`

## Issue Summary
**Original Spec:** specs/issue-1-adw-68b7e9a5-sdlc_planner-flowchart-visualization.md
**Issue:** Export functionality is completely missing. No buttons exist in the UI to export diagrams, and the utility files `mermaidGenerator.ts` and `asciiRenderer.ts` have not been implemented.
**Solution:** Create the two export utility files to generate diagram formats, and add export buttons to `App.tsx` that trigger downloads of the generated files.

## Files to Modify

### New Files to Create
- `app/client/src/utils/mermaidGenerator.ts` - Generate Mermaid diagram syntax from nodes and edges
- `app/client/src/utils/asciiRenderer.ts` - Generate ASCII flowchart from nodes and edges

### Existing Files to Modify
- `app/client/src/App.tsx` - Add export buttons for Mermaid and ASCII formats

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create Mermaid Generator Utility
- Create `app/client/src/utils/mermaidGenerator.ts`
- Implement `generateMermaid(nodes: ReactFlowNode[], edges: ReactFlowEdge[]): string` function
- Generate valid Mermaid flowchart syntax:
  - Use flowchart TB (top-bottom) direction
  - Map node types to Mermaid shapes: file→rectangle, folder→rounded rectangle, function→stadium, class→hexagon
  - Generate node definitions with IDs and labels
  - Generate edge connections with labels
  - Handle special characters in node names (escape quotes, brackets)
- Return complete Mermaid diagram as string

### Step 2: Create ASCII Renderer Utility
- Create `app/client/src/utils/asciiRenderer.ts`
- Implement `generateASCII(nodes: ReactFlowNode[], edges: ReactFlowEdge[]): string` function
- Generate ASCII art flowchart:
  - Use box-drawing characters (┌─┐│└┘├┤┬┴┼)
  - Create boxes for each node with type indicators
  - Draw connection lines between related nodes
  - Use node positions to determine spatial layout
  - Format output as readable text with proper spacing
- Return complete ASCII diagram as string

### Step 3: Add Export Buttons to App.tsx
- Import `generateMermaid` and `generateASCII` utilities
- Create `handleExportMermaid` function:
  - Call `generateMermaid(nodes, edges)`
  - Create Blob with result
  - Trigger download as `flowchart.mmd` file
- Create `handleExportASCII` function:
  - Call `generateASCII(nodes, edges)`
  - Create Blob with result
  - Trigger download as `flowchart.txt` file
- Add two export buttons next to "Save Layout" button:
  - "Export Mermaid" button (calls handleExportMermaid)
  - "Export ASCII" button (calls handleExportASCII)
- Style buttons consistently with existing "Save Layout" button

### Step 4: Test Export Functionality
- Start the application with `just start`
- Open browser to http://localhost:5173
- Click "Export Mermaid" button
- Verify `flowchart.mmd` file downloads with valid Mermaid syntax
- Click "Export ASCII" button
- Verify `flowchart.txt` file downloads with ASCII diagram
- Open downloaded files and verify content is readable

## Validation
Execute every command to validate the patch is complete with zero regressions.

### Build Validation
```bash
cd app/client && npm run build
```
**Expected:** TypeScript compilation succeeds with no errors

### Runtime Validation
```bash
just start
```
**Expected:** Server and client start successfully

### Manual Testing
1. Open browser to `http://localhost:5173`
2. Verify three export buttons are visible (Save Layout, Export Mermaid, Export ASCII)
3. Click "Export Mermaid" button → verify `flowchart.mmd` downloads
4. Open downloaded `.mmd` file → verify valid Mermaid syntax
5. Click "Export ASCII" button → verify `flowchart.txt` downloads
6. Open downloaded `.txt` file → verify ASCII diagram is readable
7. Verify existing functionality (drag nodes, save layout, timeline) still works

### Content Validation
```bash
# After downloading files manually
cat ~/Downloads/flowchart.mmd
```
**Expected:** File contains valid Mermaid flowchart syntax starting with `flowchart TB`

```bash
cat ~/Downloads/flowchart.txt
```
**Expected:** File contains ASCII art flowchart with box-drawing characters

## Patch Scope
**Lines of code to change:** ~200 lines (150 new utility code + 50 UI changes)
**Risk level:** low
**Testing required:** Manual UI testing of export buttons and verification of generated file formats
