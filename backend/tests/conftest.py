"""
Pytest configuration and fixtures for Zaitoun Loralai backend tests
"""

import pytest
import os

# Override DATABASE_URL to use in-memory SQLite before ANY app import
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from main import app
from src.models.database import Base, get_db
from src.config.auth import create_access_token


@pytest.fixture(scope="function")
def test_db():
    """Create a fresh in-memory test database for each test"""
    # Use in-memory SQLite with StaticPool to ensure all connections share the same DB
    # (without StaticPool, each connection gets its own in-memory database)
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create all tables fresh for this test
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    session = TestingSessionLocal()
    yield session

    # Cleanup after test
    session.close()
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def client(test_db):
    """Create a test client with overridden dependencies"""
    return TestClient(app)


@pytest.fixture
def admin_token(test_db):
    """Create a test admin token for authenticated endpoints"""
    return create_access_token(data={"sub": "testadmin"})


@pytest.fixture
def admin_headers(admin_token):
    """Return headers with admin bearer token"""
    return {"Authorization": f"Bearer {admin_token}"}
