// (Claude) Main application component with three-column layout

import { useState, useEffect, useCallback } from 'react';
import {
  useNodesState,
  useEdgesState,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
} from '@xyflow/react';
import { FlowCanvas } from './components/FlowCanvas';
import { Timeline } from './components/Timeline';
import { RequirementsPanel } from './components/RequirementsPanel';
import { ThreadReader } from './components/ThreadReader';
import { fetchRepoStructure, fetchLayout, inferLayout, saveLayout, fetchGitHistory, fetchRequirements } from './utils/api';
import { generateMermaid } from './utils/mermaidGenerator';
import { generateASCII } from './utils/asciiRenderer';
import type { Node, LayoutData, Commit, ThreadData } from './types';

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commitsLoading, setCommitsLoading] = useState(true);
  const [commitsError, setCommitsError] = useState<string | null>(null);
  const [requirementsContent, setRequirementsContent] = useState('');
  const [designDecisionsContent, setDesignDecisionsContent] = useState('');
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [requirementsError, setRequirementsError] = useState<string | null>(null);
  const [threadData] = useState<ThreadData | null>(null);
  const [threadLoading] = useState(false);
  const [threadError] = useState<string | null>(null);
  // TODO: Implement thread loading logic when thread file selection UI is added

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const repoData = await fetchRepoStructure();

        let positions: LayoutData;
        try {
          positions = await fetchLayout();
        } catch {
          positions = await inferLayout();
        }

        const reactFlowNodes: ReactFlowNode[] = repoData.nodes.map((node: Node) => ({
          id: node.id,
          type: node.type,
          position: positions[node.id] || { x: 0, y: 0 },
          data: node as unknown as Record<string, unknown>,
        }));

        const reactFlowEdges: ReactFlowEdge[] = repoData.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: 'default',
        }));

        setNodes(reactFlowNodes);
        setEdges(reactFlowEdges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [setNodes, setEdges]);

  useEffect(() => {
    async function loadCommits() {
      try {
        setCommitsLoading(true);
        setCommitsError(null);

        const commitData = await fetchGitHistory();
        setCommits(commitData);
      } catch (err) {
        setCommitsError(err instanceof Error ? err.message : 'Failed to load commits');
        console.error('Error loading commits:', err);
      } finally {
        setCommitsLoading(false);
      }
    }

    loadCommits();
  }, []);

  useEffect(() => {
    async function loadRequirements() {
      try {
        setRequirementsLoading(true);
        setRequirementsError(null);

        const data = await fetchRequirements();
        setRequirementsContent(data.requirements);
        setDesignDecisionsContent(data.design_decisions);
      } catch (err) {
        setRequirementsError(err instanceof Error ? err.message : 'Failed to load requirements');
        console.error('Error loading requirements:', err);
      } finally {
        setRequirementsLoading(false);
      }
    }

    loadRequirements();
  }, []);

  const handleSaveLayout = useCallback(async () => {
    try {
      const positions: LayoutData = {};
      nodes.forEach((node) => {
        positions[node.id] = node.position;
      });

      await saveLayout(positions);
      alert('Layout saved successfully!');
    } catch (err) {
      alert(`Failed to save layout: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error saving layout:', err);
    }
  }, [nodes]);

  const handleExportMermaid = useCallback(() => {
    try {
      const mermaidContent = generateMermaid(nodes, edges);
      const blob = new Blob([mermaidContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flowchart.mmd';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Failed to export Mermaid: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error exporting Mermaid:', err);
    }
  }, [nodes, edges]);

  const handleExportASCII = useCallback(() => {
    try {
      const asciiContent = generateASCII(nodes, edges);
      const blob = new Blob([asciiContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flowchart.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Failed to export ASCII: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error exporting ASCII:', err);
    }
  }, [nodes, edges]);

  return (
    <div className="app-container">
      <div className="grid grid-cols-12 h-screen">
        {/* Left Panel: Requirements (20%) */}
        <div className="col-span-2 overflow-hidden">
          <RequirementsPanel
            requirementsContent={requirementsContent}
            designDecisionsContent={designDecisionsContent}
            loading={requirementsLoading}
            error={requirementsError}
          />
        </div>

        {/* Center Panel: FlowCanvas + Timeline (60%) */}
        <div className="col-span-8 bg-white flex flex-col">
          <div className="flex-1 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Loading repository structure...
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center text-red-500">
                Error: {error}
              </div>
            ) : (
              <>
                <FlowCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  selectedCommit={selectedCommit}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleSaveLayout}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-lg"
                  >
                    Save Layout
                  </button>
                  <button
                    onClick={handleExportMermaid}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-lg"
                  >
                    Export Mermaid
                  </button>
                  <button
                    onClick={handleExportASCII}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded shadow-lg"
                  >
                    Export ASCII
                  </button>
                </div>
              </>

            )}
          </div>
          <div className="h-32 bg-gray-50 border-t border-gray-200">
            {commitsLoading ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Loading git history...
              </div>
            ) : commitsError ? (
              <div className="h-full flex items-center justify-center text-red-500 text-sm">
                Error loading commits: {commitsError}
              </div>
            ) : (
              <Timeline
                commits={commits}
                selectedCommit={selectedCommit}
                onCommitSelect={setSelectedCommit}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Thread Reader (20%) */}
        <div className="col-span-2 overflow-hidden">
          <ThreadReader
            threadData={threadData}
            loading={threadLoading}
            error={threadError}
          />
          {/* TODO: Add thread file selection UI in future enhancement */}
        </div>
      </div>
    </div>
  );
}

export default App;
