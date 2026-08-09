"""
One-time script: update the admin account's username and password.

Takes the desired username and password as CLI arguments (never hardcoded in
this file, never committed). The password is bcrypt-hashed via the app's own
hash_password() before touching the database — only the hash is stored.

Behavior:
  - If an admin with the target username already exists  -> updates its password hash.
  - Otherwise, the EXISTING admin (currently `admin`)   -> is renamed to the target
    username and its password hash is replaced.
  - Any admin whose password is NOT being changed is left untouched.

Idempotent and safe to re-run.

Usage:
  python scripts/update_admin_credentials.py <username> <password>      # dry run (print only)
  python scripts/update_admin_credentials.py <username> <password> --apply   # execute for real
"""

import sys
import os

# Allow running from the backend/ directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.models.database import SessionLocal
from src.models import AdminUser
from src.config.auth import hash_password


def main():
    args = [a for a in sys.argv[1:] if a != "--apply"]
    dry_run = "--apply" not in sys.argv

    if len(args) != 2:
        print(__doc__)
        sys.exit(1)

    username, password = args

    db = SessionLocal()
    try:
        admins = db.query(AdminUser).order_by(AdminUser.id).all()
        if not admins:
            print("No admin users exist. Nothing to do.")
            return

        target = next((a for a in admins if a.username == username), None)
        if target:
            print(f"Admin '{username}' already exists (id={target.id}, email={target.email}).")
            print(f"  -> password hash will be REPLACED with a fresh bcrypt hash.")
            print(f"  -> username stays '{username}'.")
            new_hash = hash_password(password)
            print(f"  new hash (preview): {new_hash}")
            if dry_run:
                print("\nDRY RUN -- no changes made.")
                print(f"Re-run with --apply to execute:  python scripts/update_admin_credentials.py {username} <password> --apply")
            else:
                target.password_hash = new_hash
                db.commit()
                print(f"\n[OK] Password updated for admin '{username}'.")
        else:
            print(f"Admin '{username}' not found. Existing admins:")
            for a in admins:
                print(f"  id={a.id}  username='{a.username}'  email={a.email}")
            print(f"\nThe FIRST admin (id={admins[0].id}, '{admins[0].username}') will be renamed to '{username}'")
            print(f"and its password hash replaced.")
            new_hash = hash_password(password)
            print(f"  new hash (preview): {new_hash}")
            if dry_run:
                print("\nDRY RUN -- no changes made.")
                print(f"Re-run with --apply to execute:  python scripts/update_admin_credentials.py {username} <password> --apply")
            else:
                admins[0].username = username
                admins[0].password_hash = new_hash
                db.commit()
                print(f"\n[OK] Admin '{admins[0].username}' (id={admins[0].id}) updated with new password.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
