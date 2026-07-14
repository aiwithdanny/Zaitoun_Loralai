"""Add product_group_id and size_label to products

Revision ID: fc89202f95f3
Revises: 5e8ec852b1f6
Create Date: 2026-07-14 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "fc89202f95f3"
down_revision: Union[str, None] = "5e8ec852b1f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("product_group_id", sa.String(100), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column("size_label", sa.String(50), nullable=True),
    )
    op.create_index(
        op.f("ix_products_product_group_id"),
        "products",
        ["product_group_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_products_product_group_id"),
        table_name="products",
    )
    op.drop_column("products", "size_label")
    op.drop_column("products", "product_group_id")
