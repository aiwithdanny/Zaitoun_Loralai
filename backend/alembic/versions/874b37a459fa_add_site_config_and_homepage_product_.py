"""add site config and homepage product section columns plus product accordions table

Revision ID: 874b37a459fa
Revises: d4e5f6a7b8c9
Create Date: 2026-08-10 05:42:25.913702

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '874b37a459fa'
down_revision: Union[str, None] = 'd4e5f6a7b8c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── site_config: add footer_legal_links (JSON) ──
    op.add_column("site_config", sa.Column("footer_legal_links", sa.JSON(), nullable=True))

    # ── homepage_content: add product section fields ──
    op.add_column("homepage_content", sa.Column("product_section_tag", sa.String(length=255), nullable=True))
    op.add_column("homepage_content", sa.Column("product_section_heading", sa.String(length=255), nullable=True))
    op.add_column("homepage_content", sa.Column("product_section_description", sa.Text(), nullable=True))

    # ── product_accordions: create missing table ──
    op.create_table(
        "product_accordions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    # ── product_accordions: drop table ──
    op.drop_table("product_accordions")

    # ── homepage_content: remove product section fields ──
    op.drop_column("homepage_content", "product_section_description")
    op.drop_column("homepage_content", "product_section_heading")
    op.drop_column("homepage_content", "product_section_tag")

    # ── site_config: remove footer_legal_links ──
    op.drop_column("site_config", "footer_legal_links")
