// (Claude) Class node component for ReactFlow canvas

import { Handle, Position } from '@xyflow/react';
import type { ClassNode as ClassNodeType } from '../../types';

interface ClassNodeProps {
  data: ClassNodeType;
}

export function ClassNode({ data }: ClassNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center gap-2">
        <div className="text-purple-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <div className="text-sm font-medium text-gray-700">{data.name}</div>
      </div>

      {data.methods && data.methods.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {data.methods.length} method{data.methods.length !== 1 ? 's' : ''}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}
