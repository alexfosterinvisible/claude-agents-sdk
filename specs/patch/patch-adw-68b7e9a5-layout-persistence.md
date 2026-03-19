# Patch: Layout Persistence Implementation

## Metadata
adw_id: `68b7e9a5`
review_change_request: `Issue #7: Layout persistence not implemented - no Save Layout button or logic to persist node positions to backend Resolution: Add Save Layout button in App.tsx and implement logic to collect ReactFlow node positions and POST to /api/layout endpoint Severity: blocker`

## Issue Summary
**Original Spec:** specs/issue-1-adw-68b7e9a5-sdlc_planner-flowchart-visualization.md
**Issue:** The Save Layout button exists in App.tsx (lines 204-209) and the handleSaveLayout function is implemented (lines 119-132), but the implementation needs verification to ensure it correctly collects ReactFlow node positions and persists them to the backend via POST to /api/layout endpoint.
**Solution:** Verify the existing implementation works correctly by testing the Save Layout functionality end-to-end, including node position collection, API call to /api/layout POST endpoint, and layout persistence.

## Files to Modify
No files need modification - the implementation already exists in:
- `app/client/src/App.tsx` (lines 119-132: handleSaveLayout function, lines 204-209: Save Layout button)
- `app/client/src/utils/api.ts` (lines 74-91: saveLayout API function)
- `app/server/api/routes.py` (lines 196-228: POST /api/layout endpoint)

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Verify existing implementation
- Review App.tsx:119-132 to confirm handleSaveLayout collects node positions correctly
- Review utils/api.ts:74-91 to confirm saveLayout makes correct POST request
- Review routes.py:196-228 to confirm POST /api/layout endpoint accepts and saves positions

### Step 2: Test the Save Layout functionality
- Start the backend server: `cd app/server && uv run uvicorn main:app --reload`
- Start the frontend client: `cd app/client && npm run dev`
- Open browser to `http://localhost:5173`
- Drag several nodes to new positions
- Click the "Save Layout" button
- Verify success alert appears: "Layout saved successfully!"
- Check that layout.yaml file is updated with new positions

### Step 3: Test layout persistence
- Refresh the browser page
- Verify that all node positions are restored correctly from the saved layout
- Confirm no console errors appear

### Step 4: Test error handling
- Stop the backend server
- Try clicking "Save Layout" button
- Verify error alert appears with appropriate message
- Restart backend server

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. **Start backend server:**
   ```bash
   cd app/server && uv run uvicorn main:app --reload
   ```
   Expected: Server starts on http://localhost:8000

2. **Start frontend client:**
   ```bash
   cd app/client && npm run dev
   ```
   Expected: Client starts on http://localhost:5173

3. **Manual E2E test:**
   - Open http://localhost:5173 in browser
   - Verify flowchart loads with nodes
   - Drag 3-5 nodes to different positions
   - Click "Save Layout" button
   - Verify success alert: "Layout saved successfully!"
   - Refresh page
   - Verify node positions are restored correctly

4. **Check saved layout file:**
   ```bash
   cat layout.yaml
   ```
   Expected: File contains node IDs mapped to x,y coordinates

5. **Backend tests:**
   ```bash
   cd app/server && uv run pytest -xvs
   ```
   Expected: All tests pass including layout_manager and API route tests

6. **Frontend build:**
   ```bash
   cd app/client && npm run build
   ```
   Expected: Build succeeds with no TypeScript errors

## Patch Scope
**Lines of code to change:** 0 (verification only)
**Risk level:** low
**Testing required:** Manual E2E testing to verify existing implementation works correctly
