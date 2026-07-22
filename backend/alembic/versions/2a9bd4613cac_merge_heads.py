"""merge heads

Revision ID: 2a9bd4613cac
Revises: 3d3329fcf7ee, 8260e65b8d3d
Create Date: 2026-07-21 21:38:16.875825

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a9bd4613cac'
down_revision: Union[str, None] = ('3d3329fcf7ee', '8260e65b8d3d')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
