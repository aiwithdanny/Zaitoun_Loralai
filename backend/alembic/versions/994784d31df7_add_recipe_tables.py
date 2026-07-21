"""add_recipe_tables

Revision ID: 994784d31df7
Revises: 2a9bd4613cac
Create Date: 2026-07-21 21:55:00.694043

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '994784d31df7'
down_revision: Union[str, None] = '2a9bd4613cac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('recipe_content',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('section_tag', sa.String(length=255), nullable=True),
    sa.Column('headline', sa.String(length=255), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recipes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('image_url', sa.String(length=500), nullable=True),
    sa.Column('sort_order', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('recipes')
    op.drop_table('recipe_content')
