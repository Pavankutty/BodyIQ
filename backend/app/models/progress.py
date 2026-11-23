from sqlalchemy import Column, Integer, Float, Boolean, Date, DateTime, Text, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from app.database.base import Base


class ProgressRecord(Base):
    __tablename__ = "progress_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    date = Column(Date, nullable=False)

    weight_kg = Column(Float, nullable=False)

    calories_consumed = Column(Float, nullable=True)
    calories_burned = Column(Float, nullable=True)

    steps = Column(Integer, nullable=True)

    workout_completed = Column(Boolean, default=False, nullable=False)

    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "date",
            name="uq_progress_user_date"
        ),
    )