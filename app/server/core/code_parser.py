"""
(Claude) Code parser - extracts functions and classes from source files using AST and TreeSitter.

⛔ Out of scope: Semantic analysis, type inference
⏳ TODO: Add support for more languages (Go, Rust, etc.)
☑️ DONE: Python AST parsing, TreeSitter for JS/TS
"""

import ast
from pathlib import Path
from typing import List
import tree_sitter_python as tspython
import tree_sitter_javascript as tsjavascript
from tree_sitter import Language, Parser

from models import FunctionNode, ClassNode, MethodNode, BaseNode, NodeType


# Initialize TreeSitter languages
PY_LANGUAGE = Language(tspython.language())
JS_LANGUAGE = Language(tsjavascript.language())


def parse_python_file(file_path: str) -> List[BaseNode]:
    """
    Parse Python file using AST and extract functions and classes.

    Args:
        file_path: Path to Python file

    Returns:
        List of FunctionNode, ClassNode, and MethodNode objects
    """
    path = Path(file_path)

    if not path.exists():
        raise ValueError(f"File does not exist: {file_path}")

    try:
        with open(path, "r", encoding="utf-8") as f:
            source = f.read()
    except UnicodeDecodeError:
        # Skip binary or non-UTF-8 files
        return []

    nodes = []

    try:
        tree = ast.parse(source, filename=str(path))
    except SyntaxError:
        # Skip files with syntax errors
        return []

    for node in ast.walk(tree):
        # Extract function definitions
        if isinstance(node, ast.FunctionDef):
            # Check if function is inside a class
            parent_class = None
            for parent in ast.walk(tree):
                if isinstance(parent, ast.ClassDef):
                    for child in ast.walk(parent):
                        if child is node:
                            parent_class = parent.name
                            break

            param_names = [arg.arg for arg in node.args.args]

            if parent_class:
                # It's a method
                method_node = MethodNode(
                    id=f"method:{file_path}:{parent_class}:{node.name}",
                    name=node.name,
                    type=NodeType.METHOD,
                    path=str(file_path),
                    line_start=node.lineno,
                    line_end=node.end_lineno,
                    parameters=param_names,
                    parent_file=str(file_path),
                    parent_class=parent_class
                )
                nodes.append(method_node)
            else:
                # It's a standalone function
                func_node = FunctionNode(
                    id=f"function:{file_path}:{node.name}",
                    name=node.name,
                    type=NodeType.FUNCTION,
                    path=str(file_path),
                    line_start=node.lineno,
                    line_end=node.end_lineno,
                    parameters=param_names,
                    parent_file=str(file_path)
                )
                nodes.append(func_node)

        # Extract class definitions
        elif isinstance(node, ast.ClassDef):
            base_names = []
            for base in node.bases:
                if isinstance(base, ast.Name):
                    base_names.append(base.id)

            method_names = [
                n.name for n in node.body
                if isinstance(n, ast.FunctionDef)
            ]

            class_node = ClassNode(
                id=f"class:{file_path}:{node.name}",
                name=node.name,
                type=NodeType.CLASS,
                path=str(file_path),
                line_start=node.lineno,
                line_end=node.end_lineno,
                methods=method_names,
                parent_file=str(file_path),
                bases=base_names
            )
            nodes.append(class_node)

    return nodes


def parse_javascript_file(file_path: str) -> List[BaseNode]:
    """
    Parse JavaScript file using TreeSitter and extract functions and classes.

    Args:
        file_path: Path to JavaScript file

    Returns:
        List of FunctionNode and ClassNode objects
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

    nodes = []

    def traverse(node):
        """Recursively traverse TreeSitter tree."""
        # Extract function declarations
        if node.type == "function_declaration":
            name_node = node.child_by_field_name("name")
            if name_node:
                func_name = source[name_node.start_byte:name_node.end_byte].decode("utf-8")

                params_node = node.child_by_field_name("parameters")
                param_names = []
                if params_node:
                    for child in params_node.children:
                        if child.type == "identifier":
                            param_names.append(source[child.start_byte:child.end_byte].decode("utf-8"))

                func_node = FunctionNode(
                    id=f"function:{file_path}:{func_name}",
                    name=func_name,
                    type=NodeType.FUNCTION,
                    path=str(file_path),
                    line_start=node.start_point[0] + 1,
                    line_end=node.end_point[0] + 1,
                    parameters=param_names,
                    parent_file=str(file_path)
                )
                nodes.append(func_node)

        # Extract class declarations
        elif node.type == "class_declaration":
            name_node = node.child_by_field_name("name")
            if name_node:
                class_name = source[name_node.start_byte:name_node.end_byte].decode("utf-8")

                class_node = ClassNode(
                    id=f"class:{file_path}:{class_name}",
                    name=class_name,
                    type=NodeType.CLASS,
                    path=str(file_path),
                    line_start=node.start_point[0] + 1,
                    line_end=node.end_point[0] + 1,
                    methods=[],
                    parent_file=str(file_path),
                    bases=[]
                )
                nodes.append(class_node)

        # Recursively traverse children
        for child in node.children:
            traverse(child)

    traverse(tree.root_node)
    return nodes


def parse_typescript_file(file_path: str) -> List[BaseNode]:
    """
    Parse TypeScript file using TreeSitter and extract functions and classes.

    Args:
        file_path: Path to TypeScript file

    Returns:
        List of FunctionNode and ClassNode objects
    """
    # TypeScript parser is very similar to JavaScript
    return parse_javascript_file(file_path)


def parse_file(file_path: str) -> List[BaseNode]:
    """
    Parse file based on extension and extract code nodes.

    Args:
        file_path: Path to source file

    Returns:
        List of code nodes (functions, classes, methods)
    """
    path = Path(file_path)
    extension = path.suffix.lower()

    if extension == ".py":
        return parse_python_file(file_path)
    elif extension in [".js", ".jsx"]:
        return parse_javascript_file(file_path)
    elif extension in [".ts", ".tsx"]:
        return parse_typescript_file(file_path)
    else:
        return []
