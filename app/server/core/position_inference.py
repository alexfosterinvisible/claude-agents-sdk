"""
(Claude) Position inference - auto-generates initial positions for nodes using hierarchical layout.

⛔ Out of scope: Force-directed layouts, advanced graph algorithms
⏳ TODO: Add different layout strategies (circular, tree, etc.)
☑️ DONE: Basic hierarchical grid layout
"""

from typing import Dict, List
from models import BaseNode, Edge, Position, NodeType


def infer_positions(nodes: List[BaseNode], edges: List[Edge]) -> Dict[str, Position]:
    """
    Infer initial positions for nodes using hierarchical layout algorithm.

    Args:
        nodes: List of all nodes
        edges: List of all edges (for hierarchy information)

    Returns:
        Dictionary mapping node IDs to Position objects
    """
    positions = {}

    # Separate nodes by type
    folders = [n for n in nodes if n.type == NodeType.FOLDER]
    files = [n for n in nodes if n.type == NodeType.FILE]
    classes = [n for n in nodes if n.type == NodeType.CLASS]
    functions = [n for n in nodes if n.type == NodeType.FUNCTION]
    methods = [n for n in nodes if n.type == NodeType.METHOD]

    # Layout configuration
    HORIZONTAL_SPACING = 300
    LAYER_VERTICAL_OFFSET = 200

    # Layer 1: Folders (top)
    y_offset = 0
    for i, folder in enumerate(folders):
        x = i * HORIZONTAL_SPACING
        y = y_offset
        positions[folder.id] = Position(x=x, y=y)

    # Layer 2: Files
    y_offset += LAYER_VERTICAL_OFFSET
    for i, file in enumerate(files):
        x = i * HORIZONTAL_SPACING
        y = y_offset
        positions[file.id] = Position(x=x, y=y)

    # Layer 3: Classes
    y_offset += LAYER_VERTICAL_OFFSET
    for i, cls in enumerate(classes):
        x = i * HORIZONTAL_SPACING
        y = y_offset
        positions[cls.id] = Position(x=x, y=y)

    # Layer 4: Functions
    y_offset += LAYER_VERTICAL_OFFSET
    for i, func in enumerate(functions):
        x = i * HORIZONTAL_SPACING
        y = y_offset
        positions[func.id] = Position(x=x, y=y)

    # Layer 5: Methods
    y_offset += LAYER_VERTICAL_OFFSET
    for i, method in enumerate(methods):
        x = i * HORIZONTAL_SPACING
        y = y_offset
        positions[method.id] = Position(x=x, y=y)

    return positions


def check_overlaps(positions: Dict[str, Position], min_distance: float = 50.0) -> bool:
    """
    Check if any nodes overlap (within min_distance).

    Args:
        positions: Dictionary of node positions
        min_distance: Minimum allowed distance between nodes

    Returns:
        True if overlaps detected, False otherwise
    """
    pos_list = list(positions.values())

    for i, pos1 in enumerate(pos_list):
        for pos2 in pos_list[i + 1:]:
            distance = ((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2) ** 0.5
            if distance < min_distance:
                return True

    return False
