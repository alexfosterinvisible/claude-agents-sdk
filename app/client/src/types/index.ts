// (Claude) Type definitions for SDLC Planner API responses

export interface Position {
  x: number;
  y: number;
}

export interface BaseNode {
  id: string;
  type: 'file' | 'folder' | 'function' | 'class';
  name: string;
  path: string;
  parent_id: string | null;
}

export interface FileNode extends BaseNode {
  type: 'file';
  extension: string;
  size: number;
  last_modified: string;
  last_commit?: Commit;
}

export interface FolderNode extends BaseNode {
  type: 'folder';
  children_count: number;
}

export interface FunctionNode extends BaseNode {
  type: 'function';
  parameters: string[];
  return_type?: string;
  file_path: string;
  line_number: number;
}

export interface ClassNode extends BaseNode {
  type: 'class';
  methods: string[];
  file_path: string;
  line_number: number;
}

export type Node = FileNode | FolderNode | FunctionNode | ClassNode;

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'import' | 'call' | 'inheritance' | 'contains';
}

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface Branch {
  name: string;
  current: boolean;
  commit: string;
}

export interface ThreadMessage {
  id: string;
  timestamp: string;
  author: string;
  content: string;
  toolUses?: string[];
}

export interface ThreadData {
  id: string;
  title: string;
  messages: ThreadMessage[];
}

export interface RepoStructure {
  nodes: Node[];
  edges: Edge[];
  root_path: string;
}

export interface LayoutData {
  [nodeId: string]: Position;
}

export interface RequirementsData {
  requirements: string;
  design_decisions: string;
}
