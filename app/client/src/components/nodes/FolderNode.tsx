// (Claude) Folder node component for ReactFlow canvas

import { Handle, Position } from '@xyflow/react';
import type { FolderNode as FolderNodeType } from '../../types';

interface FolderNodeProps {
  data: FolderNodeType;
}

export function FolderNode({ data }: FolderNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-500 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center gap-2">
        <div className="text-yellow-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        </div>
        <div className="text-sm font-medium text-gray-700">{data.name}</div>
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {data.children_count} item{data.children_count !== 1 ? 's' : ''}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}
