/**
 * Mermaid Flowchart Generator (Claude)
 * Generates Mermaid diagram syntax from React Flow nodes and edges
 */

import { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';

/**
 * Escape special characters in node labels for Mermaid syntax
 */
function escapeMermaidLabel(label: string): string {
  return label
    .replace(/"/g, '#quot;')
    .replace(/\[/g, '#91;')
    .replace(/\]/g, '#93;')
    .replace(/\(/g, '#40;')
    .replace(/\)/g, '#41;');
}

/**
 * Map node type to Mermaid shape syntax
 */
function getNodeShape(type: string | undefined, id: string, label: string): string {
  const escapedLabel = escapeMermaidLabel(label);

  switch (type) {
    case 'file':
      return `${id}[${escapedLabel}]`; // Rectangle
    case 'folder':
      return `${id}(${escapedLabel})`; // Rounded rectangle
    case 'function':
      return `${id}([${escapedLabel}])`; // Stadium
    case 'class':
      return `${id}{{${escapedLabel}}}`; // Hexagon
    default:
      return `${id}[${escapedLabel}]`; // Default rectangle
  }
}

/**
 * Generate Mermaid flowchart syntax from React Flow nodes and edges
 */
export function generateMermaid(nodes: ReactFlowNode[], edges: ReactFlowEdge[]): string {
  const lines: string[] = [];

  // Start with flowchart declaration
  lines.push('flowchart TB');
  lines.push('');

  // Generate node definitions
  lines.push('  %% Node definitions');
  nodes.forEach(node => {
    const nodeId = node.id.replace(/[^a-zA-Z0-9_]/g, '_');
    const label = String(node.data?.label || node.id);
    const nodeShape = getNodeShape(node.type, nodeId, label);
    lines.push(`  ${nodeShape}`);
  });

  lines.push('');

  // Generate edge connections
  if (edges.length > 0) {
    lines.push('  %% Connections');
    edges.forEach(edge => {
      const sourceId = edge.source.replace(/[^a-zA-Z0-9_]/g, '_');
      const targetId = edge.target.replace(/[^a-zA-Z0-9_]/g, '_');
      const label = edge.label ? ` -->|${escapeMermaidLabel(String(edge.label))}| ` : ' --> ';
      lines.push(`  ${sourceId}${label}${targetId}`);
    });
  }

  return lines.join('\n');
}
