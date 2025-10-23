"""
(Claude) Dependency analyzer - extracts import statements and function call graphs.

⛔ Out of scope: Dynamic imports, cross-language dependencies
⏳ TODO: Add function call graph analysis
☑️ DONE: Import extraction for Python and JS/TS
"""

import ast
from pathlib import Path
from typing import List
import tree_sitter_python as tspython
import tree_sitter_javascript as tsjavascript
from tree_sitter import Language, Parser

from models import ImportEdge, EdgeType


# Initialize TreeSitter languages
PY_LANGUAGE = Language(tspython.language())
JS_LANGUAGE = Language(tsjavascript.language())


def analyze_python_imports(file_path: str) -> List[ImportEdge]:
    """
    Analyze Python file and extract import statements.

    Args:
        file_path: Path to Python file

    Returns:
        List of ImportEdge objects
    """
    path = Path(file_path)

    if not path.exists():
        raise ValueError(f"File does not exist: {file_path}")

    try:
        with open(path, "r", encoding="utf-8") as f:
            source = f.read()
    except UnicodeDecodeError:
        return []

    edges = []

    try:
        tree = ast.parse(source, filename=str(path))
    except SyntaxError:
        return []

    for node in ast.walk(tree):
        # Handle "import x" statements
        if isinstance(node, ast.Import):
            for alias in node.names:
                import_name = alias.name
                # Try to resolve to file path
                target_path = import_name.replace(".", "/") + ".py"

                edge = ImportEdge(
                    id=f"import:{file_path}:{import_name}",
                    source=f"file:{file_path}",
                    target=f"file:{target_path}",
                    type=EdgeType.IMPORT,
                    import_name=import_name
                )
                edges.append(edge)

        # Handle "from x import y" statements
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                module_name = node.module
                target_path = module_name.replace(".", "/") + ".py"

                for alias in node.names:
                    import_name = f"{module_name}.{alias.name}"

                    edge = ImportEdge(
                        id=f"import:{file_path}:{import_name}",
                        source=f"file:{file_path}",
                        target=f"file:{target_path}",
                        type=EdgeType.IMPORT,
                        import_name=import_name
                    )
                    edges.append(edge)

    return edges


def analyze_javascript_imports(file_path: str) -> List[ImportEdge]:
    """
    Analyze JavaScript/TypeScript file and extract import statements.

    Args:
        file_path: Path to JS/TS file

    Returns:
        List of ImportEdge objects
    """
    path = Path(file_path)

    if not path.exists():
        raise ValueError(f"File does not exist: {file_path}")

    try:
        with open(path, "rb") as f:
            source = f.read()
    except Exception:
        return []

    parser = Parser(JS_LANGUAGE)
    tree = parser.parse(source)

    edges = []

    def traverse(node):
        """Recursively traverse TreeSitter tree."""
        # Handle ES6 import statements
        if node.type == "import_statement":
            # Get the source (e.g., "./module")
            source_node = node.child_by_field_name("source")
            if source_node:
                import_source = source[source_node.start_byte:source_node.end_byte].decode("utf-8")
                # Remove quotes
                import_source = import_source.strip('"').strip("'")

                edge = ImportEdge(
                    id=f"import:{file_path}:{import_source}",
                    source=f"file:{file_path}",
                    target=f"file:{import_source}",
                    type=EdgeType.IMPORT,
                    import_name=import_source
                )
                edges.append(edge)

        # Recursively traverse children
        for child in node.children:
            traverse(child)

    traverse(tree.root_node)
    return edges


def analyze_imports(file_path: str) -> List[ImportEdge]:
    """
    Analyze file and extract import dependencies.

    Args:
        file_path: Path to source file

    Returns:
        List of ImportEdge objects
    """
    path = Path(file_path)
    extension = path.suffix.lower()

    if extension == ".py":
        return analyze_python_imports(file_path)
    elif extension in [".js", ".jsx", ".ts", ".tsx"]:
        return analyze_javascript_imports(file_path)
    else:
        return []
