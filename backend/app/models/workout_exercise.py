from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint
from app.database.base import Base


class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    exercise_name = Column(String(150), nullable=False)
    planned_sets = Column(Integer, nullable=False, default=3)
    planned_reps = Column(Integer, nullable=False, default=10)
    completed_sets = Column(Integer, nullable=False, default=0)
    is_completed = Column(Boolean, nullable=False, default=False)
    position = Column(Integer, nullable=False, default=0)
    __table_args__ = (UniqueConstraint("session_id", "position", name="uq_workout_exercise_position"),)