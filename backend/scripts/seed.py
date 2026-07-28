"""
Seed / update database with product data.
All prices are in PKR (Pakistani Rupees).

Idempotent — safe to re-run. Updates existing products by slug,
inserts new ones, and soft-deletes products that no longer belong.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.models import Product
from src.models.database import engine, Base, SessionLocal
from datetime import datetime, timezone

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Migration: add sort_order column if missing ─────────────────────
try:
    from sqlalchemy import text
    db.execute(text("ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0"))
    db.commit()
except Exception:
    db.rollback()  # column already exists

try:
    from sqlalchemy import text
    db.execute(text("ALTER TABLE products ADD COLUMN product_group_id VARCHAR(100)"))
    db.commit()
except Exception:
    db.rollback()  # column already exists

try:
    from sqlalchemy import text
    db.execute(text("ALTER TABLE products ADD COLUMN size_label VARCHAR(50)"))
    db.commit()
except Exception:
    db.rollback()  # column already exists

# ── Products to keep (update in place by slug) ──────────────────────────
products_data = [
    {
        "slug": "extra-virgin-250ml",
        "name": "Extra Virgin Olive Oil - 250ml",
        "description": "Cold-pressed extra virgin olive oil in a 250ml bottle. Hand-harvested from the mountains of Loralai with early harvest grapes for a robust, peppery finish.",
        "short_description": "Cold-pressed, early harvest — perfect for drizzling",
        "price": 1200,
        "discount_price": None,
        "stock": 50,
        "category": "Bottles",
        "image_url": None,   # resolved client-side by slug
        "is_active": True,
        "is_featured": True,
        "sort_order": 1,
        "product_group_id": "extra-virgin-olive-oil",
        "size_label": "250ml",
    },
    {
        "slug": "extra-virgin-500ml",
        "name": "Extra Virgin Olive Oil - 500ml",
        "description": "Cold-pressed extra virgin olive oil in a 500ml bottle. Perfect for everyday cooking and finishing dishes. Our bestseller with balanced flavour and aroma.",
        "short_description": "Our bestseller — everyday cooking and finishing",
        "price": 2200,
        "discount_price": None,
        "stock": 100,
        "category": "Bottles",
        "image_url": None,
        "is_active": True,
        "is_featured": True,
        "sort_order": 2,
        "product_group_id": "extra-virgin-olive-oil",
        "size_label": "500ml",
    },
    {
        "slug": "extra-virgin-300ml-can",
        "name": "Extra Virgin Olive Oil - 300ml Can",
        "description": "Premium extra virgin olive oil in a 300ml tin can. Perfect for gifting with an elegant presentation and extended shelf life.",
        "short_description": "Premium tin — gift-ready, travel-friendly",
        "price": 800,
        "discount_price": None,
        "stock": 30,
        "category": "Cans",
        "image_url": None,
        "is_active": True,
        "is_featured": False,
        "sort_order": 3,
        "product_group_id": "extra-virgin-olive-oil",
        "size_label": "300ml Can",
    },
    {
        "slug": "extra-virgin-500ml-can",
        "name": "Extra Virgin Olive Oil - 500ml Can",
        "description": "Premium extra virgin olive oil in a 500ml tin can. Best value with superior packaging protection — a family kitchen staple.",
        "short_description": "Best value tin — family kitchen staple",
        "price": 1400,
        "discount_price": None,
        "stock": 25,
        "category": "Cans",
        "image_url": None,
        "is_active": True,
        "is_featured": False,
        "sort_order": 4,
        "product_group_id": "extra-virgin-olive-oil",
        "size_label": "500ml Can",
    },
    {
        "slug": "extra-virgin-3l",
        "name": "Extra Virgin Olive Oil - 3L",
        "description": "Bulk-size extra virgin olive oil for serious home cooks and small restaurants. 3 litres of premium cold-pressed olive oil at a great per-litre price.",
        "short_description": "Bulk size for serious cooking and restaurants",
        "price": 7500,
        "discount_price": None,
        "stock": 15,
        "category": "Bulk",
        "image_url": None,
        "is_active": True,
        "is_featured": False,
        "sort_order": 5,
        "product_group_id": "extra-virgin-olive-oil",
        "size_label": "3L",
    },
    {
        "slug": "extra-virgin-5l",
        "name": "Extra Virgin Olive Oil - 5L",
        "description": "Wholesale-size extra virgin olive oil for restaurants, caterers, and households that go through olive oil fast. Best price per litre in the range.",
        "short_description": "Wholesale size — best price per litre",
        "price": 11500,
        "discount_price": None,
        "stock": 10,
        "category": "Bulk",
        "image_url": None,
        "is_active": True,
        "is_featured": False,
        "sort_order": 6,
        "product_group_id": "extra-virgin-olive-oil",
        "size_label": "5L",
    },
]

now = datetime.now(timezone.utc)

# ── Upsert: update existing by slug, insert new ───────────────────────
for data in products_data:
    slug = data["slug"]
    existing = db.query(Product).filter(Product.slug == slug).first()

    if existing:
        for key, val in data.items():
            setattr(existing, key, val)
        existing.updated_at = now
    else:
        data["created_at"] = now
        data["updated_at"] = now
        db.add(Product(**data))

# ── Soft-delete products that no longer belong ─────────────────────────
slugs_to_keep = {p["slug"] for p in products_data}
orphans = db.query(Product).filter(
    Product.slug.notin_(slugs_to_keep),
    Product.is_active == True,
).all()

for product in orphans:
    product.is_active = False
    product.updated_at = now

db.commit()

# ── Report ─────────────────────────────────────────────────────────────
active_count = db.query(Product).filter(Product.is_active == True).count()
inactive_count = db.query(Product).filter(Product.is_active == False).count()
total_count = db.query(Product).count()
print(f"[OK] Active products: {active_count}")
print(f"[OK] Inactive (archived) products: {inactive_count}")
print(f"[OK] Total products in DB: {total_count}")

for p in db.query(Product).filter(Product.is_active == True).order_by(Product.sort_order.asc(), Product.id.asc()).all():
    print(f"  sort_order={p.sort_order}  {p.id}. {p.name} — Rs. {p.price:,}  [{p.slug}]  group={p.product_group_id}  size={p.size_label}")

for p in db.query(Product).filter(Product.is_active == False).order_by(Product.id).all():
    print(f"  {p.id}. {p.name} — INACTIVE")

db.close()
