"""
(Claude) Repository structure analyzer - walks directory tree and extracts files/folders as nodes.

⛔ Out of scope: Binary file analysis, remote repository support
⏳ TODO: Add caching for large repositories
☑️ DONE: Basic directory traversal with exclusion support
"""

from pathlib import Path
from typing import List
import os

from models import NodeType, FolderNode, FileNode, BaseNode, RepoStructure, Edge, EdgeType
from config import CFG


def analyze_repo(repo_path: str) -> RepoStructure:
    """
    Analyze repository structure and extract files/folders as nodes.

    Args:
        repo_path: Path to repository root

    Returns:
        RepoStructure containing all nodes and edges
    """
    repo = Path(repo_path).resolve()

    if not repo.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")
    elif not repo.is_dir():
        raise ValueError(f"Repository path is not a directory: {repo_path}")

    nodes: List[BaseNode] = []
    edges: List[Edge] = []

    # Walk the directory tree
    for root, dirs, files in os.walk(repo):
        root_path = Path(root)

        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in CFG.exclude_dirs]

        # Create folder node for current directory
        relative_path = root_path.relative_to(repo)
        if str(relative_path) != ".":
            folder_node = FolderNode(
                id=f"folder:{relative_path}",
                name=root_path.name,
                type=NodeType.FOLDER,
                path=str(relative_path),
                children=[]
            )
            nodes.append(folder_node)

        # Create file nodes
        for file in files:
            file_path = root_path / file
            relative_file_path = file_path.relative_to(repo)

            # Get file size
            try:
                file_size = file_path.stat().st_size
            except OSError:
                file_size = 0

            file_node = FileNode(
                id=f"file:{relative_file_path}",
                name=file,
                type=NodeType.FILE,
                path=str(relative_file_path),
                extension=file_path.suffix,
                size=file_size
            )
            nodes.append(file_node)

            # Create containment edge from folder to file
            if str(relative_path) != ".":
                edge = Edge(
                    id=f"contains:{relative_path}:{file}",
                    source=f"folder:{relative_path}",
                    target=f"file:{relative_file_path}",
                    type=EdgeType.CONTAINS
                )
                edges.append(edge)

    return RepoStructure(
        nodes=nodes,
        edges=edges,
        root_path=str(repo)
    )


def get_file_nodes(repo_path: str, extensions: List[str] = None) -> List[FileNode]:
    """
    Get all file nodes in repository, optionally filtered by extension.

    Args:
        repo_path: Path to repository root
        extensions: List of file extensions to include (e.g., [".py", ".js"])

    Returns:
        List of FileNode objects
    """
    structure = analyze_repo(repo_path)
    file_nodes = [node for node in structure.nodes if isinstance(node, FileNode)]

    if extensions:
        file_nodes = [node for node in file_nodes if node.extension in extensions]

    return file_nodes
