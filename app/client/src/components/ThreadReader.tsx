/**
 * (Claude) ThreadReader component for displaying Claude Code conversation threads.
 *
 * Renders parsed ASL/JSONL thread data with collapsible/expandable messages,
 * tool uses, and timestamps. Provides loading/error states and scrollable content.
 */

import React, { useState } from 'react';
import type { ThreadData, ThreadMessage } from '../types';

interface ThreadReaderProps {
  threadData: ThreadData | null;
  loading: boolean;
  error: string | null;
}

interface MessageItemProps {
  message: ThreadMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toolUsesExpanded, setToolUsesExpanded] = useState<Record<number, boolean>>({});

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  const truncateContent = (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  const shouldShowToggle = message.content.length > 100;
  const displayContent = isExpanded ? message.content : truncateContent(message.content);

  const toggleToolUse = (index: number) => {
    setToolUsesExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-3">
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <span className={`font-semibold text-sm ${
            message.author === 'user'
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-purple-700 dark:text-purple-400'
          }`}>
            {message.author === 'user' ? 'User' : 'Assistant'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {displayContent}
        </div>

        {shouldShowToggle && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {message.toolUses && message.toolUses.length > 0 && (
          <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Tool Uses ({message.toolUses.length})
            </div>
            <div className="space-y-2">
              {message.toolUses.map((toolUse, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded">
                  <button
                    onClick={() => toggleToolUse(index)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-left text-xs text-gray-700 dark:text-gray-300 flex items-center justify-between"
                  >
                    <span>Tool {index + 1}</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        toolUsesExpanded[index] ? 'rotate-180' : ''
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
                  {toolUsesExpanded[index] && (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800">
                      <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words font-mono">
                        {toolUse}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ThreadReader: React.FC<ThreadReaderProps> = ({
  threadData,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">
          Loading thread...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400 p-4 text-center">
          Error loading thread: {error}
        </div>
      </div>
    );
  }

  if (!threadData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-500 p-4 text-center">
          No thread loaded
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-800">
      <div className="p-4">
        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {threadData.title}
          </h2>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {threadData.messages.length} message{threadData.messages.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="space-y-3">
          {threadData.messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
};
