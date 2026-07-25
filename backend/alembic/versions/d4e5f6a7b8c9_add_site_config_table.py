"""add site_config table

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-07-25 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d4e5f6a7b8c9"
down_revision: Union[str, None] = "c3d4e5f6a7b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "site_config",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("site_name", sa.String(255), nullable=True),
        sa.Column("tagline", sa.String(255), nullable=True),
        sa.Column("logo_url", sa.String(500), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("address", sa.String(500), nullable=True),
        sa.Column("facebook_url", sa.String(500), nullable=True),
        sa.Column("instagram_url", sa.String(500), nullable=True),
        sa.Column("x_url", sa.String(500), nullable=True),
        sa.Column("youtube_url", sa.String(500), nullable=True),
        sa.Column("footer_about_text", sa.Text(), nullable=True),
        sa.Column("footer_copyright_text", sa.String(500), nullable=True),
        sa.Column("nav_links", sa.JSON(), nullable=True),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_site_config_id"), "site_config", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_site_config_id"), table_name="site_config")
    op.drop_table("site_config")
