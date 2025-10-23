"""
(Claude) Tests for main FastAPI application.

☑️ DONE: Basic API health check tests
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint returns OK."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "name" in data
    print("✓ Root endpoint test passed")


def test_health_endpoint():
    """Test health endpoint returns healthy."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("✓ Health endpoint test passed")
