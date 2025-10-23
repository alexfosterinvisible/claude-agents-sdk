# Patch: Implement Timeline Component with Git Commit Visualization

## Metadata
adw_id: `68b7e9a5`
review_change_request: `Issue #2: Timeline component not implemented - shows 'Timeline coming soon...' instead of git commit timeline with scrubber Resolution: Implement Timeline.tsx component to display horizontal scrollable git commit timeline with interactive scrubber and commit selection Severity: blocker`

## Issue Summary
**Original Spec:** specs/issue-1-adw-68b7e9a5-sdlc_planner-flowchart-visualization.md
**Issue:** The Timeline section at the bottom of the center panel currently displays placeholder text "Timeline coming soon..." instead of an interactive git commit timeline with scrubber functionality.
**Solution:** Implement Timeline.tsx component to fetch and display git commit history horizontally with an interactive scrubber for timeline navigation and commit selection that highlights affected nodes in the flowchart.

## Files to Modify

- `app/client/src/components/Timeline.tsx` (create new file)
- `app/client/src/App.tsx` (integrate Timeline component)
- `app/client/src/types/index.ts` (verify Commit interface exists - already present)
- `app/client/src/utils/api.ts` (add fetchGitHistory function)
- `app/server/api/routes.py` (verify GET /api/git/history endpoint exists)

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create Git History API endpoint (backend)
- Add `GET /api/git/history` endpoint in `app/server/api/routes.py`
- Use GitPython to extract commit history: sha, author, date, message
- Return JSON array of commits ordered chronologically
- Handle repository not initialized case gracefully

### Step 2: Create fetchGitHistory API client utility (frontend)
- In `app/client/src/utils/api.ts`, add `fetchGitHistory()` function
- Make GET request to `/api/git/history` endpoint
- Return typed array of `Commit[]` based on interface in types/index.ts
- Include error handling for network failures

### Step 3: Implement Timeline.tsx component
- Create `app/client/src/components/Timeline.tsx`
- Accept props: `commits: Commit[]`, `onCommitSelect: (commit: Commit | null) => void`, `selectedCommit: Commit | null`
- Display horizontal scrollable container with commit markers
- Each commit marker shows: author initials, short date, tooltip with full message
- Implement interactive scrubber/slider that can be dragged along timeline
- Emit `onCommitSelect` event when commit is clicked
- Highlight the currently selected commit with distinct visual styling
- Style with TailwindCSS for responsive layout

### Step 4: Integrate Timeline into App.tsx
- Import Timeline component in `app/client/src/App.tsx`
- Add state: `const [commits, setCommits] = useState<Commit[]>([])` and `const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null)`
- Fetch commits in useEffect: `const commitData = await fetchGitHistory()`
- Replace placeholder "Timeline coming soon..." with `<Timeline commits={commits} selectedCommit={selectedCommit} onCommitSelect={setSelectedCommit} />`
- Add loading and error states for commit fetching

### Step 5: Connect Timeline selection to FlowCanvas highlighting
- Pass `selectedCommit` prop to FlowCanvas component
- In FlowCanvas, implement visual highlighting for nodes affected by selected commit
- Add git commit association logic (requires backend support - can be placeholder for now)
- Show commit hash badge or indicator on affected nodes

## Validation
Execute every command to validate the patch is complete with zero regressions.

### Backend Tests
```bash
cd app/server && uv run pytest tests/ -v
```
**Expected**: All tests pass, including any new tests for git history endpoint

### Frontend Build Check
```bash
cd app/client && npm run build
```
**Expected**: TypeScript compilation succeeds with no errors

### Manual E2E Verification
1. Start backend: `cd app/server && uv run uvicorn main:app --reload --port 8000`
2. Start frontend: `cd app/client && npm run dev`
3. Open browser to `http://localhost:5173`
4. Verify Timeline component displays at bottom of center panel
5. Verify commits are displayed horizontally with author/date information
6. Click on a commit marker → verify it becomes highlighted
7. Verify scrubber can be dragged along timeline
8. Verify tooltip shows full commit message on hover
9. Take screenshot documenting working Timeline component

### Regression Check
```bash
cd app/client && npm run dev
```
- Verify FlowCanvas still works correctly (drag nodes, save layout)
- Verify no console errors
- Verify three-column layout remains intact

## Patch Scope
**Lines of code to change:** ~200-250 lines
- Timeline.tsx: ~120 lines (new component)
- App.tsx: ~30 lines (integration)
- api.ts: ~15 lines (new API function)
- routes.py: ~40 lines (new endpoint)

**Risk level:** low-medium
- Low risk for frontend component (isolated, new file)
- Medium risk for git integration (depends on GitPython availability)

**Testing required:**
- Unit tests for git history endpoint
- Manual E2E testing of Timeline UI interactions
- Regression testing of FlowCanvas integration
