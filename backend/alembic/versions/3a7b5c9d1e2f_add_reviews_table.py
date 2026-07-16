"""add reviews table

Revision ID: 3a7b5c9d1e2f
Revises: fc89202f95f3
Create Date: 2026-07-16 12:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3a7b5c9d1e2f"
down_revision: Union[str, None] = "fc89202f95f3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("product_group_id", sa.String(100), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("review_text", sa.Text(), nullable=False),
        sa.Column("photo_url", sa.String(500), nullable=True),
        sa.Column("verified_buyer", sa.Boolean(), default=False),
        sa.Column("is_approved", sa.Boolean(), default=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_reviews_id"), "reviews", ["id"], unique=False)
    op.create_index(
        op.f("ix_reviews_product_group_id"), "reviews", ["product_group_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_reviews_product_group_id"), table_name="reviews")
    op.drop_index(op.f("ix_reviews_id"), table_name="reviews")
    op.drop_table("reviews")
