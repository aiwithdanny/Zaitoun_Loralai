"""
Full model-vs-production-DB drift check.

Imports the app's real SQLAlchemy models (via src.models) and compares
each model's table definition against the live database schema. Prints
every column that exists in the model but is MISSING in the DB, plus
every column in the DB not in the model (reverse drift).

Run from backend/ so .env loads:
  python scripts/drift_check.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import inspect
from dotenv import load_dotenv

load_dotenv()

from src.models.database import engine
from src.models import Base

inspector = inspect(engine)
db_tables = set(inspector.get_table_names())

print("=== MODEL vs PRODUCTION DB DRIFT ===\n")
print(f"Tables in DB: {len(db_tables)}")

missing_tables = []
for table_name, table in Base.metadata.tables.items():
    if table_name not in db_tables:
        missing_tables.append(table_name)
        print(f"[MISSING TABLE] {table_name} (model defines it, DB does not)")
        continue

    db_cols = {c["name"] for c in inspector.get_columns(table_name)}
    model_cols = set(table.columns.keys())

    missing_cols = sorted(model_cols - db_cols)
    extra_cols = sorted(db_cols - model_cols)

    if missing_cols or extra_cols:
        print(f"\n{table_name}:")
        for c in missing_cols:
            col = table.columns[c]
            print(f"  [MODEL HAS, DB MISSING] {c} ({col.type})")
        for c in extra_cols:
            print(f"  [DB HAS, MODEL MISSING] {c}")

if missing_tables:
    print(f"\n[SUMMARY] Missing tables: {missing_tables}")

print("\n=== DONE ===")
