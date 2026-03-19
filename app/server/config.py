"""
(Claude) Configuration management for SDLC Planner flowchart system.

⛔ Out of scope: Database configuration, caching settings
⏳ TODO: Add support for multiple repo paths
☑️ DONE: Basic CFG singleton with environment variable loading
"""

from dataclasses import dataclass
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    """Global configuration singleton for SDLC Planner."""

    # Repository settings
    repo_path: Path = Path(os.getenv("REPO_PATH", "."))
    layout_file: Path = Path(os.getenv("LAYOUT_FILE", "./layout.yaml"))

    # API settings
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))

    # Client settings
    client_port: int = int(os.getenv("CLIENT_PORT", "5173"))
    client_url: str = os.getenv("CLIENT_URL", f"http://localhost:{os.getenv('CLIENT_PORT', '5173')}")

    # Feature flags
    enable_treesitter: bool = os.getenv("ENABLE_TREESITTER", "true").lower() == "true"
    enable_git_integration: bool = os.getenv("ENABLE_GIT_INTEGRATION", "true").lower() == "true"

    # Parsing settings
    exclude_dirs: list[str] = None

    def __post_init__(self):
        """Initialize default exclude directories."""
        if self.exclude_dirs is None:
            self.exclude_dirs = [".git", "__pycache__", ".venv", "node_modules", ".pytest_cache", ".mypy_cache"]


CFG = Config()
