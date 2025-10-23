#!/bin/bash
# Start SDLC Planner FastAPI backend server

set -e

cd "$(dirname "$0")/../app/server"

echo "Starting SDLC Planner API server..."
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
