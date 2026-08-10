"""
Logical backup of the production database to a timestamped SQL file.

Dumps all tables (schema + data) using psycopg2 COPY-free approach:
emits CREATE TABLE + INSERT statements, safe to re-run (drops nothing).
Output: backend/backups/db_backup_<timestamp>.sql
"""

import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, inspect, text
import psycopg2
from urllib.parse import urlparse

url = os.environ["DATABASE_URL"]
# Normalize for psycopg2 (strip sqlalchemy prefix, handle sslmode)
if "+" in url.split("://")[0]:
    scheme, rest = url.split("://", 1)
    dbname = scheme.split("+")[0]
    url = f"{dbname}://{rest}"
# Trim any accidental trailing whitespace
url = url.strip()

backup_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backups")
os.makedirs(backup_dir, exist_ok=True)
out_path = os.path.join(backup_dir, f"db_backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.sql")

engine = create_engine(url)
inspector = inspect(engine)

lines = []
lines.append("-- Zaitoun Loralai production DB logical backup")
lines.append(f"-- Generated: {datetime.utcnow().isoformat()}")
lines.append("BEGIN;")
lines.append("")

with engine.connect() as conn:
    for table in inspector.get_table_names():
        cols = inspector.get_columns(table)
        col_names = [c["name"] for c in cols]
        pk = inspector.get_pk_constraint(table)
        pk_cols = pk.get("constrained_columns") or []
        # CREATE TABLE
        col_defs = []
        for c in cols:
            col_defs.append(f'"{c["name"]}" {c["type"]}')
        create_sql = f'CREATE TABLE IF NOT EXISTS "{table}" (\n  ' + ",\n  ".join(col_defs) + "\n);"
        lines.append(create_sql)
        lines.append("")
        # INSERT data
        rows = conn.execute(text(f'SELECT * FROM "{table}"')).fetchall()
        for row in rows:
            vals = []
            for v in row:
                if v is None:
                    vals.append("NULL")
                elif isinstance(v, (int, float)):
                    vals.append(str(v))
                else:
                    s = str(v).replace("'", "''")
                    vals.append(f"'{s}'")
            lines.append(f'INSERT INTO "{table}" ({", ".join('"' + c + '"' for c in col_names)}) VALUES ({", ".join(vals)});')
        lines.append("")
        print(f"  [{table}] {len(rows)} rows")

lines.append("COMMIT;")
lines.append("")

with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"\n[OK] Backup written to {out_path}")
