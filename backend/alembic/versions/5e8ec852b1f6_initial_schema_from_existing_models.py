"""Initial schema — create all 6 tables from models

Revision ID: 5e8ec852b1f6
Revises:
Create Date: 2026-07-09 16:20:17.703391

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5e8ec852b1f6"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- products ---
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(255), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("short_description", sa.String(500), nullable=True),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("discount_price", sa.Float(), nullable=True),
        sa.Column("stock", sa.Integer(), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=True),
        sa.Column("image_url", sa.String(500), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("is_featured", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_products_id"), "products", ["id"], unique=False)
    op.create_index(op.f("ix_products_slug"), "products", ["slug"], unique=True)

    # --- orders ---
    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("order_number", sa.String(50), nullable=True),
        sa.Column("customer_name", sa.String(255), nullable=False),
        sa.Column("customer_email", sa.String(255), nullable=False),
        sa.Column("customer_phone", sa.String(50), nullable=False),
        sa.Column("customer_address", sa.Text(), nullable=True),
        sa.Column("total_amount", sa.Float(), nullable=False),
        sa.Column("status", sa.String(50), nullable=True),
        sa.Column("payment_method", sa.String(50), nullable=True),
        sa.Column("payment_status", sa.String(50), nullable=True),
        sa.Column("whatsapp_message_id", sa.String(255), nullable=True),
        sa.Column("customer_id", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_orders_id"), "orders", ["id"], unique=False)
    op.create_index(
        op.f("ix_orders_order_number"), "orders", ["order_number"], unique=True
    )

    # --- order_items ---
    op.create_table(
        "order_items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("product_name", sa.String(255), nullable=False),
        sa.Column("product_price", sa.Float(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=True),
        sa.Column("subtotal", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"],),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_order_items_id"), "order_items", ["id"], unique=False)

    # --- admin_users ---
    op.create_table(
        "admin_users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(100), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("is_admin", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("last_login", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("username"),
    )
    op.create_index(op.f("ix_admin_users_id"), "admin_users", ["id"], unique=False)

    # --- customers ---
    op.create_table(
        "customers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("last_login", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_customers_email"), "customers", ["email"], unique=True)
    op.create_index(op.f("ix_customers_id"), "customers", ["id"], unique=False)

    # --- newsletter_subscriptions ---
    op.create_table(
        "newsletter_subscriptions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("subscribed_at", sa.DateTime(), nullable=True),
        sa.Column("unsubscribed_at", sa.DateTime(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_newsletter_subscriptions_email"),
        "newsletter_subscriptions",
        ["email"],
        unique=True,
    )
    op.create_index(
        op.f("ix_newsletter_subscriptions_id"),
        "newsletter_subscriptions",
        ["id"],
        unique=False,
    )

    # Add foreign key for orders.customer_id -> customers.id
    op.create_foreign_key(
        "fk_orders_customer_id",
        "orders",
        "customers",
        ["customer_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_orders_customer_id", "orders", type_="foreignkey")
    op.drop_index(
        op.f("ix_newsletter_subscriptions_id"),
        table_name="newsletter_subscriptions",
    )
    op.drop_index(
        op.f("ix_newsletter_subscriptions_email"),
        table_name="newsletter_subscriptions",
    )
    op.drop_table("newsletter_subscriptions")
    op.drop_index(op.f("ix_customers_id"), table_name="customers")
    op.drop_index(op.f("ix_customers_email"), table_name="customers")
    op.drop_table("customers")
    op.drop_index(op.f("ix_admin_users_id"), table_name="admin_users")
    op.drop_table("admin_users")
    op.drop_index(op.f("ix_order_items_id"), table_name="order_items")
    op.drop_table("order_items")
    op.drop_index(op.f("ix_orders_order_number"), table_name="orders")
    op.drop_index(op.f("ix_orders_id"), table_name="orders")
    op.drop_table("orders")
    op.drop_index(op.f("ix_products_slug"), table_name="products")
    op.drop_index(op.f("ix_products_id"), table_name="products")
    op.drop_table("products")
