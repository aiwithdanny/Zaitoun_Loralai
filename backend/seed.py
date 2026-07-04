"""
Seed database with initial product data
All prices are in PKR (Pakistani Rupees)
Run this script once to populate the database with sample products
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.models import Product
from src.models.database import engine, Base, SessionLocal
from datetime import datetime, timezone

# Create all tables
Base.metadata.create_all(bind=engine)

# Get database session
db = SessionLocal()

# Check if products already exist
existing_count = db.query(Product).count()
if existing_count > 0:
    print("Database already contains %d products. Skipping seed." % existing_count)
    db.close()
    sys.exit(0)

# Seed products
products_data = [
    {
        "name": "Extra Virgin Olive Oil - 250ml",
        "slug": "extra-virgin-250ml",
        "description": "Cold-pressed extra virgin olive oil in 250ml bottle. Hand-harvested from the mountains of Loralai with early harvest grapes for a robust, peppery finish.",
        "short_description": "Premium quality, early harvest",
        "price": 24.99,  # PKR
        "discount_price": None,
        "stock": 50,
        "category": "Bottles",
        "image_url": None,
        "is_active": True,
        "is_featured": True,
    },
    {
        "name": "Extra Virgin Olive Oil - 500ml",
        "slug": "extra-virgin-500ml",
        "description": "Cold-pressed extra virgin olive oil in 500ml bottle. Perfect for everyday cooking and finishing dishes. Our bestseller with balanced flavor and aroma.",
        "short_description": "Best seller, family size",
        "price": 44.99,  # PKR
        "discount_price": 39.99,  # PKR
        "stock": 100,
        "category": "Bottles",
        "image_url": None,
        "is_active": True,
        "is_featured": True,
    },
    {
        "name": "Extra Virgin Olive Oil - Tin Can 300ml",
        "slug": "extra-virgin-tin-300ml",
        "description": "Premium packaging in 300ml tin can. Perfect for gifting with elegant presentation and extended shelf life.",
        "short_description": "Gift-worthy presentation",
        "price": 34.99,
        "discount_price": None,
        "stock": 30,
        "category": "Cans",
        "image_url": None,
        "is_active": True,
        "is_featured": False,
    },
    {
        "name": "Extra Virgin Olive Oil - Tin Can 500ml",
        "slug": "extra-virgin-tin-500ml",
        "description": "Premium packaging in 500ml tin can. Best value with superior packaging protection.",
        "short_description": "Best value, premium package",
        "price": 54.99,
        "discount_price": None,
        "stock": 25,
        "category": "Cans",
        "image_url": None,
        "is_active": True,
        "is_featured": False,
    },
    {
        "name": "Extra Virgin Olive Oil - Bulk 1L",
        "slug": "extra-virgin-1l",
        "description": "Bulk size for restaurants and families. 1 liter of premium extra virgin olive oil at a great price.",
        "short_description": "Bulk savings",
        "price": 79.99,
        "discount_price": None,
        "stock": 15,
        "category": "Bulk",
        "image_url": None,
        "is_active": True,
        "is_featured": False,
    },
    {
        "name": "Extra Virgin Olive Oil - Gift Set",
        "slug": "extra-virgin-gift-set",
        "description": "Curated gift set with 250ml and 500ml bottles. Perfect for olive oil enthusiasts.",
        "short_description": "Perfect gift for olive oil lovers",
        "price": 69.99,
        "discount_price": None,
        "stock": 20,
        "category": "Gift Sets",
        "image_url": None,
        "is_active": True,
        "is_featured": True,
    },
]

# Create product objects
now = datetime.now(timezone.utc)
for product_data in products_data:
    product = Product(
        **product_data,
        created_at=now,
        updated_at=now,
    )
    db.add(product)

db.commit()
print("[OK] Successfully seeded %d products" % len(products_data))
db.close()
