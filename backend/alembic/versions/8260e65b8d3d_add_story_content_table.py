"""add_story_content_table

Revision ID: 8260e65b8d3d
Revises: 3d3329fcf7ee
Create Date: 2026-07-21 21:16:18.285614

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8260e65b8d3d'
down_revision: Union[str, None] = '4d8e6f2a1c3b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('story_content',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('section_tag', sa.String(length=255), nullable=True),
    sa.Column('headline', sa.String(length=255), nullable=True),
    sa.Column('body', sa.Text(), nullable=True),
    sa.Column('pull_quote', sa.Text(), nullable=True),
    sa.Column('image_url', sa.String(length=500), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('story_content')
