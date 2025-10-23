// (Claude) FlowCanvas component using ReactFlow for interactive flowchart visualization

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FileNode } from './nodes/FileNode';
import { FolderNode } from './nodes/FolderNode';
import { FunctionNode } from './nodes/FunctionNode';
import { ClassNode } from './nodes/ClassNode';
import type { Commit } from '../types';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeDragStop?: (event: React.MouseEvent, node: Node) => void;
  selectedCommit?: Commit | null;
}

const nodeTypes: NodeTypes = {
  file: FileNode,
  folder: FolderNode,
  function: FunctionNode,
  class: ClassNode,
};

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeDragStop,
  selectedCommit,
}: FlowCanvasProps) {
  // TODO: Implement node highlighting based on selectedCommit
  // This requires backend support to map commits to affected files/nodes
  // For now, the prop is accepted for future implementation

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'file':
                return '#60a5fa';
              case 'folder':
                return '#eab308';
              case 'function':
                return '#22c55e';
              case 'class':
                return '#a855f7';
              default:
                return '#94a3b8';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>

      {/* Display selected commit badge if available */}
      {selectedCommit && (
        <div className="absolute top-16 right-4 bg-blue-100 border border-blue-300 rounded px-3 py-2 shadow-md">
          <div className="text-xs font-semibold text-blue-900">Selected Commit</div>
          <div className="text-xs text-blue-700 font-mono mt-1">
            {selectedCommit.sha.substring(0, 7)}
          </div>
        </div>
      )}
    </div>
  );
}
