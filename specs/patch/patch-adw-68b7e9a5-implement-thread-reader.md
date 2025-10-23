# Patch: Implement ThreadReader Component

## Metadata
adw_id: `68b7e9a5`
review_change_request: `Issue #4: Thread reader component not implemented - shows 'Thread reader coming soon...' instead of displaying parsed Claude Code threads Resolution: Implement ThreadReader.tsx component to display parsed ASL/JSONL thread data with collapsible/expandable message navigation Severity: blocker`

## Issue Summary
**Original Spec:** specs/issue-1-adw-68b7e9a5-sdlc_planner-flowchart-visualization.md
**Issue:** The right panel in the three-column layout shows "Thread reader coming soon..." placeholder text instead of implementing the actual ThreadReader component to display parsed Claude Code thread data. Users cannot view Claude Code conversation history alongside the flowchart visualization.
**Solution:** Create `ThreadReader.tsx` component with collapsible/expandable message navigation, integrate with the `/api/threads/{thread_file}` backend endpoint, add API utility function to fetch thread data, and update App.tsx to use the new component instead of the placeholder text.

## Files to Modify
Use these files to implement the patch:

- **`app/client/src/components/ThreadReader.tsx`** (NEW) - Create ThreadReader component with collapsible/expandable message display
- **`app/client/src/utils/api.ts`** - Add `fetchThreads()` function to call backend thread API
- **`app/client/src/types/index.ts`** - Verify ThreadData and ThreadMessage types match backend models
- **`app/client/src/App.tsx`** - Replace placeholder text with ThreadReader component integration

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create fetchThreads API utility
- Add `fetchThreads(threadFile: string): Promise<ThreadData>` function to `app/client/src/utils/api.ts`
- Call `GET /api/threads/{thread_file}` endpoint from routes.py (already exists in backend)
- Handle errors gracefully with try-catch
- Return parsed ThreadData matching frontend types

### Step 2: Create ThreadReader component
- Create `app/client/src/components/ThreadReader.tsx` with the following features:
  - Accept props: `threadData: ThreadData | null`, `loading: boolean`, `error: string | null`
  - Display loading state when data is being fetched
  - Display error state when fetch fails
  - Display "No thread loaded" message when threadData is null
  - Render messages in collapsible/expandable format:
    - Show message role (user/assistant) as header
    - Display timestamp in readable format
    - Show first 100 characters of content with "Show more"/"Show less" toggle
    - Display tool uses as expandable sections with syntax highlighting
  - Use TailwindCSS for styling with clean, readable design
  - Make messages scrollable within the panel container

### Step 3: Update App.tsx to integrate ThreadReader
- Import ThreadReader component and ThreadData type
- Add state: `const [threadData, setThreadData] = useState<ThreadData | null>(null)`
- Add state: `const [threadLoading, setThreadLoading] = useState(false)`
- Add state: `const [threadError, setThreadError] = useState<string | null>(null)`
- For now, set a sample thread file path in useEffect or hardcode a demo (e.g., load a sample .jsonl if available)
- Replace the placeholder `<div>` in right panel (lines 189-192) with:
  ```tsx
  <ThreadReader
    threadData={threadData}
    loading={threadLoading}
    error={threadError}
  />
  ```
- Add comment noting that thread file selection UI will be added in future enhancement

### Step 4: Style and test the component
- Ensure ThreadReader uses consistent styling with RequirementsPanel (left panel)
- Verify scrolling works correctly when many messages present
- Test loading, error, and success states
- Test expand/collapse functionality for messages
- Ensure timestamps display in readable format (e.g., "2024-01-15 14:30")

## Validation
Execute every command to validate the patch is complete with zero regressions.

### Backend API test
```bash
# Verify thread parsing endpoint exists and works
cd app/server && uv run pytest tests/ -v -k thread
```
**Expected:** Thread parser tests pass (if they exist)

### Frontend type check
```bash
cd app/client && npm run build
```
**Expected:** TypeScript compilation succeeds with no type errors

### Start application and verify UI
```bash
# Terminal 1: Start backend
cd app/server && uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start frontend
cd app/client && npm run dev
```
**Expected:**
1. Open `http://localhost:5173` in browser
2. Verify three-column layout displays correctly
3. Verify right panel shows ThreadReader component (not placeholder text)
4. If sample thread data loaded, verify messages display with expand/collapse functionality
5. If no thread loaded, verify "No thread loaded" message displays
6. Verify no console errors in browser DevTools

### Visual verification
- Take screenshot showing ThreadReader component in right panel
- Verify collapsible/expandable messages work correctly
- Verify styling is consistent with left panel (RequirementsPanel)
- Verify scrolling works when content exceeds panel height

## Patch Scope
**Lines of code to change:** ~150-200 lines
- ThreadReader.tsx: ~100-120 lines
- api.ts: ~15-20 lines
- App.tsx: ~20-30 lines
- types/index.ts: ~0 lines (types already exist)

**Risk level:** Low
- Backend API already exists and works
- Types already defined in frontend and backend
- Component follows existing patterns (RequirementsPanel, Timeline)
- No breaking changes to existing code

**Testing required:**
- Manual UI testing for component rendering
- Test expand/collapse functionality
- Test loading/error/success states
- Verify no regressions in other components
- Verify TypeScript compilation passes
