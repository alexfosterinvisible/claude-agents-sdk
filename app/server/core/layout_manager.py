"""
(Claude) Layout manager - loads and saves node position coordinates to/from YAML files.

⛔ Out of scope: Real-time sync, version control for layouts
⏳ TODO: Add support for multiple layout files
☑️ DONE: Basic YAML load/save for node positions
"""

from pathlib import Path
from typing import Dict
import yaml

from models import Position, LayoutData


def load_layout(layout_file: str) -> Dict[str, Position]:
    """
    Load node positions from YAML layout file.

    Args:
        layout_file: Path to layout YAML file

    Returns:
        Dictionary mapping node IDs to Position objects
    """
    path = Path(layout_file)

    if not path.exists():
        return {}

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
    except Exception:
        return {}

    if not data or "positions" not in data:
        return {}

    positions = {}
    for node_id, pos_data in data["positions"].items():
        positions[node_id] = Position(
            x=float(pos_data["x"]),
            y=float(pos_data["y"])
        )

    return positions


def save_layout(layout_file: str, positions: Dict[str, Position]) -> None:
    """
    Save node positions to YAML layout file.

    Args:
        layout_file: Path to layout YAML file
        positions: Dictionary mapping node IDs to Position objects
    """
    path = Path(layout_file)

    # Create parent directory if it doesn't exist
    path.parent.mkdir(parents=True, exist_ok=True)

    # Convert Position objects to dict
    pos_dict = {
        node_id: {"x": pos.x, "y": pos.y}
        for node_id, pos in positions.items()
    }

    layout_data = LayoutData(
        positions=positions,
        version="1.0"
    )

    # Create YAML structure
    yaml_data = {
        "version": layout_data.version,
        "positions": pos_dict
    }

    with open(path, "w", encoding="utf-8") as f:
        yaml.dump(yaml_data, f, default_flow_style=False, sort_keys=False)
