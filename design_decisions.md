# Design Decisions

## Architecture

### Backend (FastAPI)
- **Decision**: Use FastAPI for REST API
- **Rationale**: Async support, automatic OpenAPI docs, type hints, fast performance
- **Trade-offs**: Python ecosystem vs Node.js (chose Python for better ML/analysis libraries)

### Frontend (React + TypeScript)
- **Decision**: Use React with TypeScript and Vite
- **Rationale**: Type safety, fast build times with Vite, component reusability
- **Trade-offs**: React over Vue/Svelte (larger ecosystem, better Flow library support)

### Visualization (React Flow)
- **Decision**: Use @xyflow/react for flowchart rendering
- **Rationale**: Purpose-built for interactive node-edge graphs, excellent performance
- **Alternative considered**: D3.js (too low-level, more complex)

## Data Flow

### Repository Analysis Pipeline
1. Scan filesystem for files/folders
2. Parse code files for functions/classes (AST parsing)
3. Analyze imports for dependency edges
4. Query git for commit history
5. Compute or load layout positions
6. Send to frontend as structured JSON

### State Management
- **Decision**: Use React hooks (useState, useEffect) + React Flow state
- **Rationale**: Simple, no need for Redux/Zustand for current scope
- **When to reconsider**: If state becomes complex across many components

## Performance Optimizations

### Layout Caching
- Save computed layouts to JSON file
- Avoid re-computing on every load
- Allow manual override with "Infer Layout" button

### Code Parsing
- Lazy load: Only parse files as needed
- Limit to specific extensions (.py, .js, .jsx, .ts, .tsx)
- Skip node_modules, .venv, other large directories

## Future Considerations

### Scalability
- Add pagination for large repos
- Implement virtual scrolling for timeline
- Consider WebSocket for real-time updates

### Features
- Thread reader panel integration
- Search/filter nodes and edges
- Export flowchart as image/SVG
- Multi-repo comparison view
