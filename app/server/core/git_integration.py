"""
(Claude) Git integration - extracts commit history, branches, and blame data using GitPython.

⛔ Out of scope: Remote operations, push/pull, conflict resolution
⏳ TODO: Add caching for blame data
☑️ DONE: Basic commit history, branch listing, file blame
"""

from pathlib import Path
from typing import List, Dict
from datetime import datetime
from git import Repo, InvalidGitRepositoryError

from models import Commit, Branch, FileChange, BlameLine


def get_commit_history(repo_path: str, max_count: int = 100) -> List[Commit]:
    """
    Get commit history for repository.

    Args:
        repo_path: Path to git repository
        max_count: Maximum number of commits to return

    Returns:
        List of Commit objects
    """
    path = Path(repo_path)

    if not path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")

    try:
        repo = Repo(path)
    except InvalidGitRepositoryError:
        raise ValueError(f"Not a git repository: {repo_path}")

    commits = []

    for git_commit in repo.iter_commits(max_count=max_count):
        # Get files changed in this commit
        files_changed = []
        if git_commit.parents:
            diff = git_commit.parents[0].diff(git_commit)
            for change in diff:
                if change.a_path:
                    files_changed.append(change.a_path)
                elif change.b_path:
                    files_changed.append(change.b_path)

        commit = Commit(
            sha=git_commit.hexsha,
            author=git_commit.author.name,
            email=git_commit.author.email,
            date=datetime.fromtimestamp(git_commit.committed_date),
            message=git_commit.message.strip(),
            files_changed=files_changed
        )
        commits.append(commit)

    return commits


def get_branches(repo_path: str) -> List[Branch]:
    """
    Get list of branches in repository.

    Args:
        repo_path: Path to git repository

    Returns:
        List of Branch objects
    """
    path = Path(repo_path)

    if not path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")

    try:
        repo = Repo(path)
    except InvalidGitRepositoryError:
        raise ValueError(f"Not a git repository: {repo_path}")

    branches = []
    current_branch = repo.active_branch.name if not repo.head.is_detached else None

    for branch in repo.branches:
        branches.append(
            Branch(
                name=branch.name,
                commit_hash=branch.commit.hexsha,
                is_current=(branch.name == current_branch)
            )
        )

    return branches


def get_file_blame(repo_path: str, file_path: str) -> Dict[int, BlameLine]:
    """
    Get git blame information for a file.

    Args:
        repo_path: Path to git repository
        file_path: Relative path to file within repository

    Returns:
        Dictionary mapping line numbers to BlameLine objects
    """
    path = Path(repo_path)

    if not path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")

    try:
        repo = Repo(path)
    except InvalidGitRepositoryError:
        raise ValueError(f"Not a git repository: {repo_path}")

    blame_data = {}

    try:
        blame_info = repo.blame("HEAD", file_path)

        line_num = 1
        for commit, lines in blame_info:
            for line in lines:
                blame_data[line_num] = BlameLine(
                    line_number=line_num,
                    commit_hash=commit.hexsha,
                    author=commit.author.name,
                    date=datetime.fromtimestamp(commit.committed_date)
                )
                line_num += 1

    except Exception:
        # File might not be tracked or other error
        pass

    return blame_data


def get_file_changes(repo_path: str, commit_hash: str) -> List[FileChange]:
    """
    Get detailed file changes for a specific commit.

    Args:
        repo_path: Path to git repository
        commit_hash: Commit hash to analyze

    Returns:
        List of FileChange objects
    """
    path = Path(repo_path)

    if not path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")

    try:
        repo = Repo(path)
    except InvalidGitRepositoryError:
        raise ValueError(f"Not a git repository: {repo_path}")

    commit = repo.commit(commit_hash)
    changes = []

    if commit.parents:
        diff = commit.parents[0].diff(commit, create_patch=True)

        for change in diff:
            # Determine change type
            if change.new_file:
                change_type = "A"  # Added
            elif change.deleted_file:
                change_type = "D"  # Deleted
            elif change.renamed_file:
                change_type = "R"  # Renamed
            else:
                change_type = "M"  # Modified

            file_path = change.b_path if change.b_path else change.a_path

            # Count additions and deletions
            additions = 0
            deletions = 0
            if hasattr(change, 'diff'):
                diff_text = change.diff.decode('utf-8', errors='ignore')
                for line in diff_text.split('\n'):
                    if line.startswith('+') and not line.startswith('+++'):
                        additions += 1
                    elif line.startswith('-') and not line.startswith('---'):
                        deletions += 1

            changes.append(
                FileChange(
                    path=file_path,
                    additions=additions,
                    deletions=deletions,
                    change_type=change_type
                )
            )

    return changes
