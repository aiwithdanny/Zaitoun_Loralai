"""add wholesale_config and wholesale_sizes tables

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-07-25 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c3d4e5f6a7b8"
down_revision: Union[str, None] = "b2c3d4e5f6a7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "wholesale_config",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("heading", sa.String(255), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("cta_heading", sa.String(255), nullable=True),
        sa.Column("cta_description", sa.Text(), nullable=True),
        sa.Column("whatsapp_number", sa.String(50), nullable=True),
        sa.Column("whatsapp_message", sa.String(500), nullable=True),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_wholesale_config_id"), "wholesale_config", ["id"], unique=False)

    op.create_table(
        "wholesale_sizes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("size_liters", sa.Integer(), nullable=False),
        sa.Column("sort_order", sa.Integer(), default=0),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_wholesale_sizes_id"), "wholesale_sizes", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_wholesale_sizes_id"), table_name="wholesale_sizes")
    op.drop_table("wholesale_sizes")
    op.drop_index(op.f("ix_wholesale_config_id"), table_name="wholesale_config")
    op.drop_table("wholesale_config")
