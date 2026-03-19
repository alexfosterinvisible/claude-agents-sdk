/**
 * ASCII Flowchart Renderer (Claude)
 * Generates ASCII art flowchart from React Flow nodes and edges
 */

import { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';

interface PositionedNode {
  id: string;
  label: string;
  type: string | undefined;
  x: number;
  y: number;
}

/**
 * Truncate label to fit in ASCII box
 */
function truncateLabel(label: string, maxLength: number = 20): string {
  if (label.length <= maxLength) {
    return label;
  }
  return label.substring(0, maxLength - 3) + '...';
}

/**
 * Get type indicator for node
 */
function getTypeIndicator(type: string | undefined): string {
  switch (type) {
    case 'file':
      return '[F]';
    case 'folder':
      return '[D]';
    case 'function':
      return '[FN]';
    case 'class':
      return '[C]';
    default:
      return '[ ]';
  }
}

/**
 * Create ASCII box for a node
 */
function createNodeBox(node: PositionedNode): string[] {
  const typeIndicator = getTypeIndicator(node.type);
  const label = truncateLabel(node.label);
  const boxWidth = Math.max(label.length + 4, 24);
  const padding = Math.floor((boxWidth - label.length - 2) / 2);
  const paddingRight = boxWidth - label.length - padding - 2;

  const lines: string[] = [];
  lines.push('┌' + '─'.repeat(boxWidth) + '┐');
  lines.push('│ ' + typeIndicator + ' ' + ' '.repeat(boxWidth - typeIndicator.length - 3) + '│');
  lines.push('│' + ' '.repeat(padding) + label + ' '.repeat(paddingRight) + '│');
  lines.push('└' + '─'.repeat(boxWidth) + '┘');

  return lines;
}

/**
 * Sort nodes by position (top to bottom, left to right)
 */
function sortNodesByPosition(nodes: PositionedNode[]): PositionedNode[] {
  return [...nodes].sort((a, b) => {
    if (Math.abs(a.y - b.y) < 50) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });
}

/**
 * Find edges for a given node
 */
function findOutgoingEdges(nodeId: string, edges: ReactFlowEdge[]): ReactFlowEdge[] {
  return edges.filter(edge => edge.source === nodeId);
}

/**
 * Generate ASCII flowchart from React Flow nodes and edges
 */
export function generateASCII(nodes: ReactFlowNode[], edges: ReactFlowEdge[]): string {
  if (nodes.length === 0) {
    return 'No nodes to render';
  }

  const lines: string[] = [];

  lines.push('╔════════════════════════════════════════════════════════════╗');
  lines.push('║              SDLC PLANNER FLOWCHART (ASCII)               ║');
  lines.push('╚════════════════════════════════════════════════════════════╝');
  lines.push('');

  // Convert nodes to positioned nodes
  const positionedNodes: PositionedNode[] = nodes.map(node => ({
    id: node.id,
    label: String(node.data?.label || node.id),
    type: node.type,
    x: node.position.x,
    y: node.position.y,
  }));

  // Sort nodes by position
  const sortedNodes = sortNodesByPosition(positionedNodes);

  // Track which nodes we've already connected
  const processedConnections = new Set<string>();

  // Generate ASCII boxes for each node with connections
  sortedNodes.forEach((node, index) => {
    const box = createNodeBox(node);
    box.forEach(line => lines.push(line));

    // Find outgoing edges
    const outgoingEdges = findOutgoingEdges(node.id, edges);

    if (outgoingEdges.length > 0) {
      outgoingEdges.forEach(edge => {
        const connectionKey = `${edge.source}-${edge.target}`;
        if (!processedConnections.has(connectionKey)) {
          processedConnections.add(connectionKey);

          // Add connection arrow
          if (edge.label) {
            lines.push(`  │ (${edge.label})`);
          }
          lines.push('  │');
          lines.push('  ↓');
        }
      });
    }

    // Add spacing between nodes
    if (index < sortedNodes.length - 1) {
      lines.push('');
    }
  });

  lines.push('');
  lines.push('Legend:');
  lines.push('  [F]  = File');
  lines.push('  [D]  = Directory/Folder');
  lines.push('  [FN] = Function');
  lines.push('  [C]  = Class');

  return lines.join('\n');
}
