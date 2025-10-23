/**
 * (Claude) RequirementsPanel component for displaying requirements and design decisions.
 *
 * Renders markdown content for requirements.md and design_decisions.md
 * with collapsible sections and loading/error states.
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface RequirementsPanelProps {
  requirementsContent: string;
  designDecisionsContent: string;
  loading: boolean;
  error: string | null;
}

export const RequirementsPanel: React.FC<RequirementsPanelProps> = ({
  requirementsContent,
  designDecisionsContent,
  loading,
  error,
}) => {
  const [requirementsExpanded, setRequirementsExpanded] = useState(true);
  const [designExpanded, setDesignExpanded] = useState(false);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">
          Loading documentation...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400 p-4">
          Error loading documentation: {error}
        </div>
      </div>
    );
  }

  const hasRequirements = requirementsContent.trim().length > 0;
  const hasDesignDecisions = designDecisionsContent.trim().length > 0;

  if (!hasRequirements && !hasDesignDecisions) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-500 p-4 text-center">
          No requirements.md or design_decisions.md found in repository.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-800">
      <div className="p-4 space-y-4">
        {/* Requirements Section */}
        {hasRequirements && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setRequirementsExpanded(!requirementsExpanded)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-left font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between transition-colors"
            >
              <span>Requirements</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  requirementsExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {requirementsExpanded && (
              <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{requirementsContent}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Design Decisions Section */}
        {hasDesignDecisions && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setDesignExpanded(!designExpanded)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-left font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between transition-colors"
            >
              <span>Design Decisions</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  designExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {designExpanded && (
              <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{designDecisionsContent}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
