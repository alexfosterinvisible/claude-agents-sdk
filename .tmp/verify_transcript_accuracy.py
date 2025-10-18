#!/usr/bin/env python3
"""
Verify that two transcript files contain identical words, ignoring only:
- Markdown headers (##)
- Horizontal rules (---)
- Metadata headers (Date:, Transcript of:, etc.)

☑️✅ Compare word content between markdown and text transcripts
"""

import re
from pathlib import Path
from typing import List


def extract_body_words(content: str, is_markdown: bool = False) -> List[str]:
    """Extract just the body words, removing headers and formatting."""
    lines = content.split("\n")
    body_lines = []

    # Skip initial metadata header section
    in_header = True
    for line in lines:
        # Skip markdown metadata
        if is_markdown:
            if line.startswith("#"):
                # Skip ALL markdown headers completely
                continue
            if line.startswith("**Transcript of:**"):
                continue
            if line.startswith("**Date:**"):
                continue
            if line == "---":
                if in_header:
                    in_header = False
                continue
            if in_header:
                continue
        else:
            # For .txt file, skip the simple header
            if "Transcript of:" in line:
                continue
            if "Date:" in line:
                continue
            if line.startswith("=="):
                continue
            if not line.strip() and in_header:
                continue
            in_header = False

        # Only add non-empty lines
        if line.strip():
            body_lines.append(line)

    # Join and extract words
    text = " ".join(body_lines)
    # Remove extra whitespace and split into words
    words = re.findall(r"\b\w+\b", text.lower())
    return words


def compare_files(md_file: Path, txt_file: Path):
    """Compare two transcript files."""
    print("Comparing files:")
    print(f"  MD:  {md_file}")
    print(f"  TXT: {txt_file}")
    print()

    md_content = md_file.read_text()
    txt_content = txt_file.read_text()

    md_words = extract_body_words(md_content, is_markdown=True)
    txt_words = extract_body_words(txt_content, is_markdown=False)

    print("Word counts:")
    print(f"  MD file:  {len(md_words)} words")
    print(f"  TXT file: {len(txt_words)} words")
    print()

    if md_words == txt_words:
        print("✅ SUCCESS: Files contain identical words (ignoring headers/breaks)")
        return True
    else:
        print("❌ DIFFERENCE FOUND: Words differ between files")
        print()

        # Find first difference
        min_len = min(len(md_words), len(txt_words))
        first_diff_idx = None
        for i in range(min_len):
            if md_words[i] != txt_words[i]:
                first_diff_idx = i
                break

        if first_diff_idx is not None:
            print(f"First difference at word index {first_diff_idx}:")
            start = max(0, first_diff_idx - 5)
            end = min(min_len, first_diff_idx + 6)
            print(f"  MD:  ...{' '.join(md_words[start:end])}...")
            print(f"  TXT: ...{' '.join(txt_words[start:end])}...")
        elif len(md_words) != len(txt_words):
            print(
                f"Length difference: MD has {len(md_words)}, TXT has {len(txt_words)}"
            )
            diff = abs(len(md_words) - len(txt_words))
            print(f"Difference: {diff} words")
            if len(md_words) > len(txt_words):
                print(
                    f"Extra words in MD: ...{' '.join(md_words[len(txt_words) : len(txt_words) + 10])}..."
                )
            else:
                print(
                    f"Extra words in TXT: ...{' '.join(txt_words[len(md_words) : len(md_words) + 10])}..."
                )

        return False


if __name__ == "__main__":
    base_path = Path("/Users/alex/Code3b/claude-agents-sdk/INDYDEVDAN/_1")
    md_file = base_path / "Agentic-Engineer-Build-LIVING-software.md"
    txt_file = base_path / "Agentic Engineer - Build LIVING software copy.txt"

    if not md_file.exists():
        print(f"❌ MD file not found: {md_file}")
        exit(1)

    if not txt_file.exists():
        print(f"❌ TXT file not found: {txt_file}")
        exit(1)

    success = compare_files(md_file, txt_file)
    exit(0 if success else 1)
