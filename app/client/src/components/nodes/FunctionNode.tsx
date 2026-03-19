// (Claude) Function node component for ReactFlow canvas

import { Handle, Position } from '@xyflow/react';
import type { FunctionNode as FunctionNodeType } from '../../types';

interface FunctionNodeProps {
  data: FunctionNodeType;
}

export function FunctionNode({ data }: FunctionNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center gap-2">
        <div className="text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-sm font-medium text-gray-700">{data.name}()</div>
      </div>

      {data.parameters && data.parameters.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {data.parameters.slice(0, 3).join(', ')}
          {data.parameters.length > 3 && '...'}
        </div>
      )}

      {data.return_type && (
        <div className="text-xs text-green-600 mt-1">’ {data.return_type}</div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}
