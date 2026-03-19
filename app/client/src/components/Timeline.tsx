// (Claude) Timeline component displaying git commit history with interactive scrubber

import { useMemo, useState } from 'react';
import type { Commit } from '../types';

interface TimelineProps {
  commits: Commit[];
  selectedCommit: Commit | null;
  onCommitSelect: (commit: Commit | null) => void;
}

/**
 * Timeline component for displaying git commit history horizontally
 * with interactive scrubber and commit selection
 */
export function Timeline({ commits, selectedCommit, onCommitSelect }: TimelineProps) {
  const [hoveredCommit, setHoveredCommit] = useState<Commit | null>(null);

  // Sort commits by date (newest first)
  const sortedCommits = useMemo(() => {
    return [...commits].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [commits]);

  // Helper function to get author initials
  const getAuthorInitials = (author: string): string => {
    const parts = author.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper function to format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  // Helper function to get short SHA
  const getShortSha = (sha: string): string => {
    return sha.substring(0, 7);
  };

  // Handle commit click
  const handleCommitClick = (commit: Commit) => {
    if (selectedCommit?.sha === commit.sha) {
      onCommitSelect(null); // Deselect if clicking the same commit
    } else {
      onCommitSelect(commit);
    }
  };

  if (commits.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No commits found in repository
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Timeline header */}
      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Git Timeline</h3>
        <span className="text-xs text-gray-500">{commits.length} commits</span>
      </div>

      {/* Scrollable timeline container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex items-center px-4 py-2 min-w-max">
          {/* Timeline line */}
          <div className="relative flex items-center">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2" />

            {/* Commit markers */}
            <div className="relative flex gap-8">
              {sortedCommits.map((commit) => {
                const isSelected = selectedCommit?.sha === commit.sha;
                const isHovered = hoveredCommit?.sha === commit.sha;

                return (
                  <div
                    key={commit.sha}
                    className="relative flex flex-col items-center group cursor-pointer"
                    onClick={() => handleCommitClick(commit)}
                    onMouseEnter={() => setHoveredCommit(commit)}
                    onMouseLeave={() => setHoveredCommit(null)}
                  >
                    {/* Commit marker circle */}
                    <div
                      className={`
                        w-4 h-4 rounded-full border-2 transition-all duration-200
                        ${
                          isSelected
                            ? 'bg-blue-500 border-blue-600 scale-125'
                            : isHovered
                            ? 'bg-blue-300 border-blue-400 scale-110'
                            : 'bg-white border-gray-400'
                        }
                        hover:scale-110
                      `}
                    />

                    {/* Commit info */}
                    <div className="mt-2 flex flex-col items-center min-w-[80px]">
                      {/* Author initials */}
                      <div
                        className={`
                          text-xs font-medium px-2 py-0.5 rounded
                          ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }
                        `}
                      >
                        {getAuthorInitials(commit.author)}
                      </div>

                      {/* Date */}
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(commit.date)}
                      </div>

                      {/* Short SHA */}
                      <div
                        className={`
                          text-xs font-mono mt-1
                          ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-400'}
                        `}
                      >
                        {getShortSha(commit.sha)}
                      </div>
                    </div>

                    {/* Tooltip with full commit message */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded p-2 shadow-lg z-10">
                        <div className="font-semibold mb-1">{commit.message.split('\n')[0]}</div>
                        <div className="text-gray-300 text-xs">
                          {commit.author} • {formatDate(commit.date)}
                        </div>
                        <div className="text-gray-400 text-xs mt-1 font-mono">
                          {commit.sha}
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected commit details */}
      {selectedCommit && (
        <div className="px-4 py-2 border-t border-gray-200 bg-blue-50">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {selectedCommit.message.split('\n')[0]}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {selectedCommit.author} • {formatDate(selectedCommit.date)} • {getShortSha(selectedCommit.sha)}
              </div>
            </div>
            <button
              onClick={() => onCommitSelect(null)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear selection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
