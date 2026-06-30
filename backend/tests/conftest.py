"""
Pytest configuration and fixtures for Zaitoun Loralai backend tests
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient
import os

from src.main import app
from src.models.database import Base, get_db
from src.config.auth import create_access_token


# Use in-memory SQLite for testing
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"


@pytest.fixture(scope="function")
def test_db():
    """Create a test database and yield a session"""
    engine = create_engine(
        TEST_SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    yield TestingSessionLocal()

    Base.metadata.drop_all(bind=engine)


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
