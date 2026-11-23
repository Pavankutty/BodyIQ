
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    Float,
)
from sqlalchemy.sql import func
from app.database.base import Base


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    workout_name = Column(String(150), nullable=False)

    status = Column(
        String(20),
        nullable=False,
        default="in_progress",
        index=True,
    )

    intensity = Column(
        String(20),
        nullable=False,
        default="moderate",
    )

    duration_minutes = Column(Integer, nullable=True)

    calories_burned = Column(Float, nullable=True)

    started_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    completed_at = Column(DateTime(timezone=True), nullable=True)

    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
