"""
Tests for Products API endpoints
"""

import pytest
from src.models import Product


def test_get_products_empty(client):
    """Test getting products when database is empty"""
    response = client.get("/api/v1/products/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []
    assert data["count"] == 0


def test_create_product_requires_auth(client):
    """Test that creating product requires authentication"""
    response = client.post(
        "/api/v1/products/",
        json={
            "name": "Test Oil",
            "description": "Test description",
            "price": 25.99,
            "stock": 100,
        },
    )
    assert response.status_code == 401


def test_create_product_with_auth(client, test_db, admin_headers):
    """Test creating a product with valid authentication"""
    response = client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "name": "Premium Olive Oil",
            "description": "Extra virgin olive oil from Loralai",
            "short_description": "Best quality",
            "price": 25.99,
            "stock": 100,
            "category": "Oils",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Premium Olive Oil"
    assert data["data"]["slug"] == "premium-olive-oil"


def test_get_product_by_slug(client, test_db, admin_headers):
    """Test getting a product by slug"""
    # Create product first
    create_response = client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "name": "Test Product",
            "description": "Test description for product",
            "price": 19.99,
            "stock": 50,
        },
    )

    # Get product by slug
    response = client.get("/api/v1/products/test-product")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Test Product"


def test_product_validation_fails(client, admin_headers):
    """Test that invalid product data is rejected"""
    response = client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "name": "",  # Empty name - should fail
            "description": "test",
            "price": 25.99,
        },
    )
    assert response.status_code == 422  # Validation error


def test_invalid_price_rejected(client, admin_headers):
    """Test that invalid price is rejected"""
    response = client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "name": "Test",
            "description": "Test description",
            "price": -10,  # Negative price - should fail
            "stock": 50,
        },
    )
    assert response.status_code == 422  # Validation error
