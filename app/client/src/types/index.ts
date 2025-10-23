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
}

export interface FileNode extends BaseNode {
  type: 'file';
  extension?: string;
}

export interface FolderNode extends BaseNode {
  type: 'folder';
}

export interface FunctionNode extends BaseNode {
  type: 'function';
  parameters?: string[];
  lineNumber?: number;
  parentFile: string;
}

export interface ClassNode extends BaseNode {
  type: 'class';
  methods?: string[];
  lineNumber?: number;
  parentFile: string;
}

export type Node = FileNode | FolderNode | FunctionNode | ClassNode;

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'import' | 'call';
}

export interface ImportEdge extends Edge {
  type: 'import';
  importName: string;
}

export interface CallEdge extends Edge {
  type: 'call';
  functionName: string;
}

export interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
  filesChanged: string[];
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
