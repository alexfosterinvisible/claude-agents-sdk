"""
(Claude) FastAPI application entry point for SDLC Planner.

⛔ Out of scope: WebSocket support, authentication
⏳ TODO: Add rate limiting, request logging
☑️ DONE: Basic FastAPI app with CORS
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CFG
from api.routes import router

app = FastAPI(
    title="SDLC Planner API",
    description="Flowchart visualization system for repository structure with git integration",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CFG.client_url, f"http://localhost:{CFG.client_port}"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "name": "SDLC Planner API",
        "version": "0.1.0"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=CFG.api_host,
        port=CFG.api_port,
        reload=True
    )
