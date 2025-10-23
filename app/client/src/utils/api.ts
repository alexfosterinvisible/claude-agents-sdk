// (Claude) API client utilities for SDLC Planner backend

import type { RepoStructure, LayoutData, Commit, RequirementsData, ThreadData } from '../types';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Fetch repository structure including nodes and edges
 * @param repoPath Optional path to repository (defaults to backend's configured path)
 * @returns Repository structure with nodes, edges, and root path
 */
export async function fetchRepoStructure(repoPath?: string): Promise<RepoStructure> {
  const url = new URL(`${API_BASE_URL}/api/repo/structure`);
  if (repoPath) {
    url.searchParams.append('path', repoPath);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch repository structure: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch layout positions from a saved layout file
 * @param layoutFile Optional path to layout JSON file
 * @returns Dictionary mapping node IDs to positions
 */
export async function fetchLayout(layoutFile?: string): Promise<LayoutData> {
  const url = new URL(`${API_BASE_URL}/api/layout`);
  if (layoutFile) {
    url.searchParams.append('file', layoutFile);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch layout: ${response.statusText}`);
  }

  const data = await response.json();
  return data.positions || {};
}

/**
 * Request inferred layout positions from backend using force-directed algorithm
 * @param repoPath Optional path to repository
 * @returns Dictionary mapping node IDs to inferred positions
 */
export async function inferLayout(repoPath?: string): Promise<LayoutData> {
  const url = new URL(`${API_BASE_URL}/api/layout/infer`);
  if (repoPath) {
    url.searchParams.append('path', repoPath);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to infer layout: ${response.statusText}`);
  }

  const data = await response.json();
  return data.positions || {};
}

/**
 * Save current layout positions to a file
 * @param positions Dictionary mapping node IDs to positions
 * @param layoutFile Optional output file path
 */
export async function saveLayout(positions: LayoutData, layoutFile?: string): Promise<void> {
  const url = new URL(`${API_BASE_URL}/api/layout`);
  if (layoutFile) {
    url.searchParams.append('file', layoutFile);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(positions),
  });

  if (!response.ok) {
    throw new Error(`Failed to save layout: ${response.statusText}`);
  }
}

/**
 * Fetch git commit history from repository
 * @param repoPath Optional path to repository (defaults to backend's configured path)
 * @param maxCount Maximum number of commits to fetch (default: 100, max: 1000)
 * @returns Array of Commit objects ordered chronologically
 */
export async function fetchGitHistory(repoPath?: string, maxCount: number = 100): Promise<Commit[]> {
  const url = new URL(`${API_BASE_URL}/api/git/history`);
  if (repoPath) {
    url.searchParams.append('path', repoPath);
  }
  url.searchParams.append('max_count', maxCount.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch git history: ${response.statusText}`);
  }

  const data = await response.json();
  return data.commits || [];
}

/**
 * Fetch requirements and design decisions markdown content
 * @param repoPath Optional path to repository (defaults to backend's configured path)
 * @returns Object containing requirements and design_decisions markdown strings
 */
export async function fetchRequirements(repoPath?: string): Promise<RequirementsData> {
  const url = new URL(`${API_BASE_URL}/api/docs/requirements`);
  if (repoPath) {
    url.searchParams.append('path', repoPath);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch requirements: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch parsed Claude Code thread data from JSONL/ASL file
 * @param threadFile Path to thread file (e.g., "thread_2024-01-15.jsonl")
 * @returns Parsed thread data with messages
 */
export async function fetchThreads(threadFile: string): Promise<ThreadData> {
  const url = new URL(`${API_BASE_URL}/api/threads/${encodeURIComponent(threadFile)}`);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch thread: ${response.statusText}`);
  }

  return response.json();
}
