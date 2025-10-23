# SDLC Planner Requirements

## Overview
SDLC Planner is a visual flowchart system for analyzing and visualizing software development lifecycles.

## Core Features

### 1. Repository Analysis
- Parse repository structure (files, folders, functions, classes)
- Extract import dependencies between files
- Analyze git history and commits

### 2. Flowchart Visualization
- Interactive flow canvas using React Flow
- Node types: file, folder, function, class
- Edge types: import, call, inheritance, contains
- Auto-layout with force-directed positioning
- Manual layout adjustment and saving

### 3. Timeline View
- Horizontal timeline of git commits
- Commit selection and highlighting
- Integration with flowchart view

### 4. Documentation Panels
- Requirements panel (left side)
- Thread reader panel (right side)
- Markdown rendering support

## Technical Stack
- Backend: Python + FastAPI
- Frontend: React + TypeScript + Vite
- Visualization: React Flow (@xyflow/react)
- Markdown: react-markdown

## Non-Functional Requirements
- Fast loading times (<2s for typical repos)
- Responsive UI with smooth interactions
- Support for Python, JavaScript, TypeScript files
- Git integration for version history
