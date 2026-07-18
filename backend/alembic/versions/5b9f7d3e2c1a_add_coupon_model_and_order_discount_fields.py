"""add coupon model and order discount fields

Revision ID: 5b9f7d3e2c1a
Revises: 4d8e6f2a1c3b
Create Date: 2026-07-18 14:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5b9f7d3e2c1a"
down_revision: Union[str, None] = "4d8e6f2a1c3b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create coupons table
    op.create_table(
        "coupons",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("code", sa.String(50), nullable=False),
        sa.Column("discount_type", sa.String(20), nullable=False),
        sa.Column("discount_value", sa.Float(), nullable=False),
        sa.Column("min_order_amount", sa.Float(), nullable=True),
        sa.Column("max_discount_amount", sa.Float(), nullable=True),
        sa.Column("expiry_date", sa.DateTime(), nullable=True),
        sa.Column("usage_limit", sa.Integer(), nullable=True),
        sa.Column("times_used", sa.Integer(), default=0),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code"),
    )
    op.create_index(op.f("ix_coupons_id"), "coupons", ["id"], unique=False)
    op.create_index(op.f("ix_coupons_code"), "coupons", ["code"], unique=True)

    # Add coupon fields to orders table
    op.add_column("orders", sa.Column("coupon_code", sa.String(50), nullable=True))
    op.add_column("orders", sa.Column("discount_amount", sa.Float(), default=0))


def downgrade() -> None:
    # Remove coupon fields from orders
    op.drop_column("orders", "discount_amount")
    op.drop_column("orders", "coupon_code")

    # Drop coupons table
    op.drop_index(op.f("ix_coupons_code"), table_name="coupons")
    op.drop_index(op.f("ix_coupons_id"), table_name="coupons")
    op.drop_table("coupons")
