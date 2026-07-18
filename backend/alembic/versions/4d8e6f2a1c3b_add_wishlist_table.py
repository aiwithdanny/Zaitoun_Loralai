"""add wishlist table

Revision ID: 4d8e6f2a1c3b
Revises: 3a7b5c9d1e2f
Create Date: 2026-07-18 12:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4d8e6f2a1c3b"
down_revision: Union[str, None] = "3a7b5c9d1e2f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "wishlists",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("product_group_id", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.id"],),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("customer_id", "product_group_id", name="uq_customer_product_group"),
    )
    op.create_index(op.f("ix_wishlists_id"), "wishlists", ["id"], unique=False)
    op.create_index(
        op.f("ix_wishlists_customer_id"), "wishlists", ["customer_id"], unique=False
    )
    op.create_index(
        op.f("ix_wishlists_product_group_id"), "wishlists", ["product_group_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_wishlists_product_group_id"), table_name="wishlists")
    op.drop_index(op.f("ix_wishlists_customer_id"), table_name="wishlists")
    op.drop_index(op.f("ix_wishlists_id"), table_name="wishlists")
    op.drop_table("wishlists")
