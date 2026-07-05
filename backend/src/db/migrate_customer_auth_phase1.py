"""
Phase 1 Migration: Add customer authentication support

Creates:
  - customers table (id, name, email, phone, password_hash, ...)
  - customer_id nullable FK on orders table
"""

from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(DATABASE_URL, echo=True)


def run_migration():
    inspector = inspect(engine)

    # --- 1. Create customers table ---
    if "customers" not in inspector.get_table_names():
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE customers (
                    id INTEGER NOT NULL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    phone VARCHAR(50),
                    password_hash VARCHAR(255) NOT NULL,
                    is_active BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME
                )
            """))
            conn.commit()
        print("[OK] Created 'customers' table")
    else:
        print("[INFO] 'customers' table already exists, skipping")

    # --- 2. Add customer_id FK to orders ---
    orders_columns = [c["name"] for c in inspector.get_columns("orders")]
    if "customer_id" not in orders_columns:
        with engine.connect() as conn:
            conn.execute(text("""
                ALTER TABLE orders
                ADD COLUMN customer_id INTEGER REFERENCES customers(id)
            """))
            conn.commit()
        print("[OK] Added 'customer_id' column to 'orders' table")
    else:
        print("[INFO] 'customer_id' column already exists on 'orders', skipping")

    print("\nMigration complete!")


if __name__ == "__main__":
    run_migration()
