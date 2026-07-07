"""
Backfill: Link existing orders to registered customers by matching email.

This script runs a single UPDATE:
  SET orders.customer_id = customers.id
  WHERE orders.customer_email = customers.email
    AND orders.customer_id IS NULL

It is fully idempotent:
  - Already-linked orders (customer_id IS NOT NULL) are never touched.
  - Re-running produces the same result (nothing to do after first run).

Usage:
  python scripts/backfill_customer_orders.py          # dry run (print only)
  python scripts/backfill_customer_orders.py --apply   # execute for real
"""

import sys
import os

# Allow running from the backend/ directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.models.database import SessionLocal
from src.models import Order, Customer
from sqlalchemy import func


def main():
    dry_run = "--apply" not in sys.argv

    db = SessionLocal()

    # Find orders that have a matching customer by email but no customer_id link
    rows = (
        db.query(
            Order.id,
            Order.order_number,
            Order.customer_email,
            Order.created_at,
            Order.status,
            Customer.id.label("customer_id"),
            Customer.name.label("customer_name"),
        )
        .join(Customer, Customer.email == Order.customer_email)
        .filter(Order.customer_id.is_(None))
        .order_by(Order.id)
        .all()
    )

    if not rows:
        print("No unlinked orders found. Nothing to do.")
        db.close()
        return

    print(f"Found {len(rows)} order(s) to link:\n")
    print(f"  {'Order #':>8}  {'Order Number':24s}  {'Customer Email':30s}  {'-> Customer #':>14s}  {'Customer Name'}")
    print(f"  {'-'*8}  {'-'*24}  {'-'*30}  {'-'*14}  {'-'*20}")
    for r in rows:
        print(
            f"  {r.id:>8}  {r.order_number:24s}  {r.customer_email:30s}"
            f"  -> #{r.customer_id:>10d}  {r.customer_name}"
        )

    if dry_run:
        print("\nDRY RUN -- no changes made.")
        print("Re-run with --apply to execute:  python scripts/backfill_customer_orders.py --apply")
    else:
        for r in rows:
            db.query(Order).filter(Order.id == r.id).update(
                {"customer_id": r.customer_id},
                synchronize_session=False,
            )
        db.commit()
        print("\nSuccessfully linked %d order(s) to their customers." % len(rows))
        print("Run again with no --apply to verify nothing is left unlinked.")

    db.close()


if __name__ == "__main__":
    main()
