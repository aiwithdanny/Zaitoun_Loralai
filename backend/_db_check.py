import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text

url = os.environ.get("DATABASE_URL", "")
engine = create_engine(url, pool_pre_ping=True, pool_recycle=3600)

with engine.connect() as conn:
    r = conn.execute(text("SELECT MAX(id) FROM order_items")).scalar()
    print(f"MAX(id) in order_items: {r}")
    
    r = conn.execute(text("SELECT last_value FROM order_items_id_seq")).scalar()
    print(f"Sequence last_value: {r}")
    
    rows = conn.execute(text("SELECT id, order_number, customer_email FROM orders ORDER BY id DESC LIMIT 3")).fetchall()
    for row in rows:
        print(f"Order: id={row[0]}, number={row[1]}, email={row[2]}")
    
    r = conn.execute(text("SELECT MAX(id), COUNT(*) FROM order_items")).fetchone()
    print(f"order_items: MAX(id)={r[0]}, COUNT(*)={r[1]}")
    
    r = conn.execute(text("SELECT MAX(id) FROM orders")).scalar()
    seq = conn.execute(text("SELECT last_value FROM orders_id_seq")).scalar()
    print(f"orders: MAX(id)={r}, seq={seq}")

print("DONE")
