"""
Database migration script for Zaitoun Loralai
Creates all database tables
"""

from src.models.database import engine, Base
from src.models import Product, Order, OrderItem, AdminUser, NewsletterSubscription


def create_tables():
    """Create all database tables"""
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("All tables created successfully!")
        print("Tables: products, orders, order_items, admin_users, newsletter_subscriptions")
    except Exception as e:
        print(f"Error creating tables: {e}")


if __name__ == "__main__":
    create_tables()
