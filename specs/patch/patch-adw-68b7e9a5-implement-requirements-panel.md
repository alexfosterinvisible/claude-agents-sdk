# Patch: Implement Requirements Panel with Markdown Rendering

## Metadata
adw_id: `68b7e9a5`
review_change_request: `Issue #3: Requirements panel not implemented - shows 'Requirements panel coming soon...' instead of displaying requirements.md content Resolution: Implement RequirementsPanel.tsx component to fetch and display requirements.md and design_decisions.md with markdown rendering Severity: blocker`

## Issue Summary
**Original Spec:** specs/issue-1-adw-68b7e9a5-sdlc_planner-flowchart-visualization.md
**Issue:** Left panel shows placeholder text "Requirements panel coming soon..." instead of displaying requirements.md and design_decisions.md content
**Solution:** Create RequirementsPanel.tsx component with markdown rendering, add backend API endpoint to serve markdown content, and integrate into App.tsx

## Files to Modify
- `app/server/api/routes.py` - Add GET endpoint to fetch requirements/design docs
- `app/client/src/components/RequirementsPanel.tsx` - Create new component (currently missing)
- `app/client/src/utils/api.ts` - Add API client function for fetching requirements
- `app/client/src/types/index.ts` - Add types for requirements data
- `app/client/src/App.tsx` - Replace placeholder with RequirementsPanel component

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add backend API endpoint for requirements content
- Add GET `/api/docs/requirements` endpoint in `app/server/api/routes.py`
- Endpoint should read `requirements.md` from repo root (CFG.repo_path)
- Also read `design_decisions.md` or similar docs if they exist
- Return JSON with `{requirements: string, design_decisions: string}`
- Handle file not found gracefully (return empty strings)

### Step 2: Create RequirementsPanel component
- Create `app/client/src/components/RequirementsPanel.tsx`
- Accept props: `requirementsContent: string`, `designDecisionsContent: string`, `loading: boolean`, `error: string | null`
- Use `react-markdown` (already in package.json) to render markdown content
- Create two collapsible sections: "Requirements" and "Design Decisions"
- Add scrollable container with Tailwind styling
- Show loading state and error state

### Step 3: Add API client function
- Add `fetchRequirements()` function to `app/client/src/utils/api.ts`
- Fetch from `/api/docs/requirements` endpoint
- Return type should match backend response structure
- Include error handling

### Step 4: Add TypeScript types
- Add `RequirementsData` interface to `app/client/src/types/index.ts`
- Define structure: `{requirements: string, design_decisions: string}`

### Step 5: Integrate RequirementsPanel into App.tsx
- Import RequirementsPanel component
- Add state for requirements content, loading, and error
- Fetch requirements data in useEffect on mount
- Replace placeholder div in left panel with RequirementsPanel component
- Pass fetched data as props

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. **Backend validation**:
```bash
cd app/server && uv run pytest
```
Expected: All existing tests pass

2. **Type check frontend**:
```bash
cd app/client && npm run build
```
Expected: TypeScript compilation succeeds with no errors

3. **Start backend**:
```bash
cd app/server && uv run uvicorn main:app --reload --port 8000
```
Expected: Server starts successfully

4. **Start frontend**:
```bash
cd app/client && npm run dev
```
Expected: Frontend builds and serves on port 5173

5. **Manual verification**:
- Open browser to http://localhost:5173
- Verify left panel shows "Requirements" section (not placeholder text)
- Verify markdown is rendered correctly
- Verify collapsible sections work if implemented
- Verify error state if no requirements.md exists
- Take screenshot showing working requirements panel

## Patch Scope
**Lines of code to change:** ~150-200 lines total
- Backend: ~25 lines (new endpoint)
- RequirementsPanel.tsx: ~80-100 lines (new component)
- api.ts: ~15 lines (new function)
- types/index.ts: ~5 lines (new type)
- App.tsx: ~30 lines (integration)

**Risk level:** low
- No changes to existing functionality
- Purely additive (new component + endpoint)
- Uses existing react-markdown dependency

**Testing required:**
- Manual verification of markdown rendering
- Verify loading/error states
- Ensure no regression in FlowCanvas or Timeline components
