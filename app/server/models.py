"""
(Claude) Pydantic models for SDLC Planner API request/response schemas.

⛔ Out of scope: Database ORM models
⏳ TODO: Add validation for file paths
☑️ DONE: Core node, edge, and git data models
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum


class NodeType(str, Enum):
    """Type of node in the flowchart."""
    FOLDER = "folder"
    FILE = "file"
    FUNCTION = "function"
    CLASS = "class"
    METHOD = "method"


class Position(BaseModel):
    """2D position for node layout."""
    x: float
    y: float


class BaseNode(BaseModel):
    """Base class for all node types."""
    id: str
    name: str
    type: NodeType
    path: str
    line_start: Optional[int] = None
    line_end: Optional[int] = None


class FolderNode(BaseNode):
    """Folder in the repository."""
    type: NodeType = NodeType.FOLDER
    children: List[str] = Field(default_factory=list)


class FileNode(BaseNode):
    """File in the repository."""
    type: NodeType = NodeType.FILE
    extension: str
    size: int


class FunctionNode(BaseNode):
    """Function or method definition."""
    type: NodeType = NodeType.FUNCTION
    parameters: List[str] = Field(default_factory=list)
    parent_file: str
    parent_class: Optional[str] = None


class ClassNode(BaseNode):
    """Class definition."""
    type: NodeType = NodeType.CLASS
    methods: List[str] = Field(default_factory=list)
    parent_file: str
    bases: List[str] = Field(default_factory=list)


class MethodNode(BaseNode):
    """Method within a class."""
    type: NodeType = NodeType.METHOD
    parameters: List[str] = Field(default_factory=list)
    parent_file: str
    parent_class: str


class EdgeType(str, Enum):
    """Type of edge/connection in the flowchart."""
    IMPORT = "import"
    CALL = "call"
    INHERITANCE = "inheritance"
    CONTAINS = "contains"


class Edge(BaseModel):
    """Connection between two nodes."""
    id: str
    source: str
    target: str
    type: EdgeType
    label: Optional[str] = None


class ImportEdge(Edge):
    """Import dependency between files."""
    type: EdgeType = EdgeType.IMPORT
    import_name: str


class CallEdge(Edge):
    """Function call dependency."""
    type: EdgeType = EdgeType.CALL
    line_number: int


class Commit(BaseModel):
    """Git commit information."""
    sha: str = Field(alias="hash")
    author: str
    email: str
    date: datetime
    message: str
    files_changed: List[str] = Field(default_factory=list)

    class Config:
        populate_by_name = True


class Branch(BaseModel):
    """Git branch information."""
    name: str
    commit_hash: str
    is_current: bool = False


class FileChange(BaseModel):
    """File modification in a commit."""
    path: str
    additions: int
    deletions: int
    change_type: str  # "A" for added, "M" for modified, "D" for deleted


class BlameLine(BaseModel):
    """Git blame information for a line."""
    line_number: int
    commit_hash: str
    author: str
    date: datetime


class RepoStructure(BaseModel):
    """Complete repository structure."""
    nodes: List[BaseNode]
    edges: List[Edge]
    root_path: str


class ThreadMessage(BaseModel):
    """Message in a Claude Code thread."""
    role: str
    content: str
    timestamp: datetime
    tool_uses: List[Dict] = Field(default_factory=list)


class ThreadData(BaseModel):
    """Complete thread data."""
    thread_id: str
    messages: List[ThreadMessage]
    created_at: datetime
    updated_at: datetime


class LayoutData(BaseModel):
    """Layout positions for all nodes."""
    positions: Dict[str, Position]
    version: str = "1.0"


class ErrorResponse(BaseModel):
    """Error response."""
    error: str
    detail: Optional[str] = None
