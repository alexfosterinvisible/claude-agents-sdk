"""
(Claude) REST API routes for SDLC Planner flowchart system.

⛔ Out of scope: Authentication, rate limiting
⏳ TODO: Add caching, pagination for large results
☑️ DONE: Core API endpoints for repo analysis, git history, layout
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional

from core import repo_analyzer, code_parser, dependency_analyzer, git_integration, layout_manager, position_inference, thread_parser
from models import RepoStructure, BaseNode, Edge, Commit, Branch, Position, LayoutData, ThreadData, ErrorResponse
from config import CFG

router = APIRouter(prefix="/api", tags=["api"])


@router.get("/repo/structure")
async def get_repo_structure(path: Optional[str] = None) -> Dict:
    """
    Get repository structure (files, folders, functions, classes).

    Args:
        path: Repository path (defaults to CFG.repo_path)

    Returns:
        RepoStructure with nodes and edges
    """
    repo_path = path or str(CFG.repo_path)

    try:
        # Get basic file/folder structure
        structure = repo_analyzer.analyze_repo(repo_path)

        # Parse code files to extract functions and classes
        code_nodes = []
        for node in structure.nodes:
            if hasattr(node, 'extension') and node.extension in ['.py', '.js', '.jsx', '.ts', '.tsx']:
                try:
                    parsed_nodes = code_parser.parse_file(node.path)
                    code_nodes.extend(parsed_nodes)
                except Exception:
                    continue

        # Combine all nodes
        all_nodes = structure.nodes + code_nodes

        return {
            "nodes": [node.model_dump() for node in all_nodes],
            "edges": [edge.model_dump() for edge in structure.edges],
            "root_path": structure.root_path
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/repo/dependencies")
async def get_dependencies(path: Optional[str] = None) -> Dict:
    """
    Get import dependencies between files.

    Args:
        path: Repository path (defaults to CFG.repo_path)

    Returns:
        List of ImportEdge objects
    """
    repo_path = path or str(CFG.repo_path)

    try:
        structure = repo_analyzer.analyze_repo(repo_path)

        all_edges = []

        # Analyze imports for each code file
        for node in structure.nodes:
            if hasattr(node, 'extension') and node.extension in ['.py', '.js', '.jsx', '.ts', '.tsx']:
                try:
                    import_edges = dependency_analyzer.analyze_imports(node.path)
                    all_edges.extend(import_edges)
                except Exception:
                    continue

        return {
            "edges": [edge.model_dump() for edge in all_edges]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/git/history")
async def get_git_history(
    path: Optional[str] = None,
    max_count: int = Query(default=100, le=1000)
) -> Dict:
    """
    Get git commit history.

    Args:
        path: Repository path (defaults to CFG.repo_path)
        max_count: Maximum number of commits to return

    Returns:
        List of Commit objects
    """
    repo_path = path or str(CFG.repo_path)

    try:
        commits = git_integration.get_commit_history(repo_path, max_count=max_count)

        return {
            "commits": [commit.model_dump() for commit in commits]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/git/branches")
async def get_git_branches(path: Optional[str] = None) -> Dict:
    """
    Get git branches.

    Args:
        path: Repository path (defaults to CFG.repo_path)

    Returns:
        List of Branch objects
    """
    repo_path = path or str(CFG.repo_path)

    try:
        branches = git_integration.get_branches(repo_path)

        return {
            "branches": [branch.model_dump() for branch in branches]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/git/blame/{file_path:path}")
async def get_git_blame(file_path: str, repo_path: Optional[str] = None) -> Dict:
    """
    Get git blame data for a file.

    Args:
        file_path: Relative path to file within repository
        repo_path: Repository path (defaults to CFG.repo_path)

    Returns:
        Dictionary mapping line numbers to BlameLine objects
    """
    repo = repo_path or str(CFG.repo_path)

    try:
        blame_data = git_integration.get_file_blame(repo, file_path)

        return {
            "blame": {str(k): v.model_dump() for k, v in blame_data.items()}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/layout")
async def get_layout(file: Optional[str] = None) -> Dict:
    """
    Load layout positions from file.

    Args:
        file: Layout file path (defaults to CFG.layout_file)

    Returns:
        Dictionary of node positions
    """
    layout_file = file or str(CFG.layout_file)

    try:
        positions = layout_manager.load_layout(layout_file)

        return {
            "positions": {k: v.model_dump() for k, v in positions.items()},
            "file": layout_file
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/layout")
async def save_layout_positions(
    positions: Dict[str, Dict[str, float]],
    file: Optional[str] = None
) -> Dict:
    """
    Save layout positions to file.

    Args:
        positions: Dictionary mapping node IDs to {x, y} coordinates
        file: Layout file path (defaults to CFG.layout_file)

    Returns:
        Success message
    """
    layout_file = file or str(CFG.layout_file)

    try:
        # Convert to Position objects
        pos_objects = {
            node_id: Position(x=coords["x"], y=coords["y"])
            for node_id, coords in positions.items()
        }

        layout_manager.save_layout(layout_file, pos_objects)

        return {
            "message": "Layout saved successfully",
            "file": layout_file
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/layout/infer")
async def infer_layout(path: Optional[str] = None) -> Dict:
    """
    Auto-infer initial positions for nodes.

    Args:
        path: Repository path (defaults to CFG.repo_path)

    Returns:
        Dictionary of inferred positions
    """
    repo_path = path or str(CFG.repo_path)

    try:
        structure = repo_analyzer.analyze_repo(repo_path)

        # Parse code files
        code_nodes = []
        for node in structure.nodes:
            if hasattr(node, 'extension') and node.extension in ['.py', '.js', '.jsx', '.ts', '.tsx']:
                try:
                    parsed_nodes = code_parser.parse_file(node.path)
                    code_nodes.extend(parsed_nodes)
                except Exception:
                    continue

        all_nodes = structure.nodes + code_nodes

        # Infer positions
        positions = position_inference.infer_positions(all_nodes, structure.edges)

        return {
            "positions": {k: v.model_dump() for k, v in positions.items()}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/threads/{thread_file}")
async def get_thread(thread_file: str) -> Dict:
    """
    Parse and return thread data.

    Args:
        thread_file: Path to thread file

    Returns:
        ThreadData object
    """
    try:
        thread = thread_parser.parse_asl_thread(thread_file)

        return thread.model_dump()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
