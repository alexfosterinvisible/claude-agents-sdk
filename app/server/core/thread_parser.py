"""
(Claude) Thread parser - parses Claude Code ASL/JSONL thread exports.

⛔ Out of scope: Real-time thread monitoring, thread generation
⏳ TODO: Add support for multi-level summarization
☑️ DONE: Basic JSONL parsing for Claude Code threads
"""

from pathlib import Path
from typing import List
import json
from datetime import datetime

from models import ThreadData, ThreadMessage


def parse_asl_thread(thread_file: str) -> ThreadData:
    """
    Parse Claude Code ASL/JSONL thread file.

    Args:
        thread_file: Path to JSONL thread file

    Returns:
        ThreadData object with parsed messages
    """
    path = Path(thread_file)

    if not path.exists():
        raise ValueError(f"Thread file does not exist: {thread_file}")

    messages = []

    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue

                try:
                    data = json.loads(line)

                    # Extract message fields
                    role = data.get("role", "unknown")
                    content = data.get("content", "")

                    # Handle content as list (for tool uses)
                    if isinstance(content, list):
                        text_content = []
                        tool_uses = []

                        for item in content:
                            if isinstance(item, dict):
                                if item.get("type") == "text":
                                    text_content.append(item.get("text", ""))
                                elif item.get("type") == "tool_use":
                                    tool_uses.append(item)

                        content = "\n".join(text_content)
                    elif not isinstance(content, str):
                        content = str(content)

                    # Extract timestamp
                    timestamp = data.get("timestamp", None)
                    if timestamp:
                        if isinstance(timestamp, str):
                            timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
                        elif isinstance(timestamp, (int, float)):
                            timestamp = datetime.fromtimestamp(timestamp)
                    else:
                        timestamp = datetime.now()

                    tool_uses = data.get("tool_uses", [])

                    message = ThreadMessage(
                        role=role,
                        content=content,
                        timestamp=timestamp,
                        tool_uses=tool_uses if isinstance(tool_uses, list) else []
                    )
                    messages.append(message)

                except json.JSONDecodeError:
                    continue

    except Exception:
        pass

    # Create thread data
    thread_id = path.stem
    created_at = messages[0].timestamp if messages else datetime.now()
    updated_at = messages[-1].timestamp if messages else datetime.now()

    return ThreadData(
        thread_id=thread_id,
        messages=messages,
        created_at=created_at,
        updated_at=updated_at
    )


def parse_multiple_threads(thread_dir: str) -> List[ThreadData]:
    """
    Parse all thread files in a directory.

    Args:
        thread_dir: Path to directory containing thread files

    Returns:
        List of ThreadData objects
    """
    path = Path(thread_dir)

    if not path.exists() or not path.is_dir():
        return []

    threads = []

    for thread_file in path.glob("*.jsonl"):
        try:
            thread = parse_asl_thread(str(thread_file))
            threads.append(thread)
        except Exception:
            continue

    for thread_file in path.glob("*.asl"):
        try:
            thread = parse_asl_thread(str(thread_file))
            threads.append(thread)
        except Exception:
            continue

    return threads
