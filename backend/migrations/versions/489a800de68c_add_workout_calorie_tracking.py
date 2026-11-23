"""add workout calorie tracking

Revision ID: 489a800de68c
Revises: 792407e8ee9e
Create Date: 2026-11-03 12:25:58.298606

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '489a800de68c'
down_revision: Union[str, Sequence[str], None] = '792407e8ee9e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    # Add intensity with a temporary default for existing records.
    op.add_column(
        "workout_sessions",
        sa.Column(
            "intensity",
            sa.String(length=20),
            nullable=False,
            server_default="moderate",
        ),
    )

    # Add workout duration.
    op.add_column(
        "workout_sessions",
        sa.Column(
            "duration_minutes",
            sa.Integer(),
            nullable=True,
        ),
    )

    # Add estimated calories.
    op.add_column(
        "workout_sessions",
        sa.Column(
            "calories_burned",
            sa.Float(),
            nullable=True,
        ),
    )

    # Remove the database-level default after existing rows are populated.
    op.alter_column(
        "workout_sessions",
        "intensity",
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column("workout_sessions", "calories_burned")
    op.drop_column("workout_sessions", "duration_minutes")
    op.drop_column("workout_sessions", "intensity")
