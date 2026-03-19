// (Claude) File node component for ReactFlow canvas

import { Handle, Position } from '@xyflow/react';
import type { FileNode as FileNodeType } from '../../types';

interface FileNodeProps {
  data: FileNodeType;
}

export function FileNode({ data }: FileNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center gap-2">
        <div className="text-blue-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-.707-.707A1 1 0 0012.586 2H7.414a1 1 0 00-.707.293l-.707.707A1 1 0 015.414 3H4z" />
          </svg>
        </div>
        <div className="text-sm font-medium text-gray-700">{data.name}</div>
      </div>

      {data.extension && (
        <div className="text-xs text-gray-500 mt-1">.{data.extension}</div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}
