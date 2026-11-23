"""add diet type to users

Revision ID: d9edcab4ba50
Revises: 9c158ae1828d
Create Date: ...
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'd9edcab4ba50'
down_revision: Union[str, Sequence[str], None] = '9c158ae1828d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column(
            'diet_type',
            sa.String(length=20),
            nullable=True
        )
    )

    op.execute(
        "UPDATE users SET diet_type = 'Veg' "
        "WHERE diet_type IS NULL"
    )

    op.alter_column(
        'users',
        'diet_type',
        nullable=False
    )


def downgrade() -> None:
    op.drop_column('users', 'diet_type')