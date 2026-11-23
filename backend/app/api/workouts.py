
from datetime import date, datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.models.progress import ProgressRecord
from app.models.workout_session import WorkoutSession
from app.models.workout_exercise import WorkoutExercise


router = APIRouter(prefix="/workouts", tags=["Workouts"])


# =========================================================
# REQUEST SCHEMAS
# =========================================================

class ExerciseInput(BaseModel):
    exercise_name: str = Field(min_length=1, max_length=150)
    planned_sets: int = Field(default=3, ge=1, le=20)
    planned_reps: int = Field(default=10, ge=1, le=100)


class WorkoutStartInput(BaseModel):
    workout_name: str = Field(min_length=1, max_length=150)
    intensity: Literal["light", "moderate", "vigorous"] = "moderate"
    exercises: list[ExerciseInput] = Field(min_length=1, max_length=30)


class SetProgressInput(BaseModel):
    completed_sets: int = Field(ge=0, le=20)


# =========================================================
# CALORIE CALCULATION
# =========================================================

MET_VALUES = {
    "light": 3.5,
    "moderate": 5.0,
    "vigorous": 6.0,
}


def calculate_calories(
    weight_kg: float,
    duration_minutes: int,
    intensity: str,
) -> float:

    met = MET_VALUES[intensity]

    calories = (
        met * 3.5 * weight_kg / 200
    ) * duration_minutes

    return round(calories, 2)


# =========================================================
# RESPONSE SERIALIZATION
# =========================================================

def serialize_session(session: WorkoutSession, db: Session):

    exercises = (
        db.query(WorkoutExercise)
        .filter(WorkoutExercise.session_id == session.id)
        .order_by(WorkoutExercise.position)
        .all()
    )

    planned = sum(e.planned_sets for e in exercises)
    completed = sum(e.completed_sets for e in exercises)

    return {
        "id": session.id,
        "workout_name": session.workout_name,
        "status": session.status,
        "intensity": session.intensity,
        "started_at": session.started_at,
        "completed_at": session.completed_at,
        "duration_minutes": session.duration_minutes,
        "calories_burned": session.calories_burned,
        "planned_sets": planned,
        "completed_sets": completed,
        "completion_percent": (
            round(completed / planned * 100) if planned else 0
        ),
        "exercises": [
            {
                "id": e.id,
                "exercise_name": e.exercise_name,
                "planned_sets": e.planned_sets,
                "planned_reps": e.planned_reps,
                "completed_sets": e.completed_sets,
                "is_completed": e.is_completed,
                "position": e.position,
            }
            for e in exercises
        ],
    }


# =========================================================
# START WORKOUT
# =========================================================

@router.post("/start")
def start_workout(
    payload: WorkoutStartInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    existing = (
        db.query(WorkoutSession)
        .filter(
            WorkoutSession.user_id == current_user.id,
            WorkoutSession.status == "in_progress",
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="You already have a workout in progress. Resume or finish it first.",
        )

    session = WorkoutSession(
        user_id=current_user.id,
        workout_name=payload.workout_name,
        intensity=payload.intensity,
        status="in_progress",
    )

    db.add(session)
    db.flush()

    for position, exercise in enumerate(payload.exercises):

        db.add(
            WorkoutExercise(
                session_id=session.id,
                exercise_name=exercise.exercise_name.strip(),
                planned_sets=exercise.planned_sets,
                planned_reps=exercise.planned_reps,
                completed_sets=0,
                is_completed=False,
                position=position,
            )
        )

    db.commit()
    db.refresh(session)

    return serialize_session(session, db)


# =========================================================
# GET TODAY'S WORKOUT
# =========================================================

@router.get("/today")
def get_today_workout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    today = date.today()

    session = (
        db.query(WorkoutSession)
        .filter(
            WorkoutSession.user_id == current_user.id,
            WorkoutSession.started_at >= datetime.combine(
                today, datetime.min.time(), tzinfo=timezone.utc
            ),
            WorkoutSession.status.in_(["in_progress", "completed"]),
        )
        .order_by(WorkoutSession.started_at.desc())
        .first()
    )

    if not session:
        return None

    return serialize_session(session, db)


# =========================================================
# UPDATE COMPLETED SETS
# =========================================================

@router.patch("/{session_id}/exercises/{exercise_id}/sets")
def update_completed_sets(
    session_id: int,
    exercise_id: int,
    payload: SetProgressInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    session = (
        db.query(WorkoutSession)
        .filter(
            WorkoutSession.id == session_id,
            WorkoutSession.user_id == current_user.id,
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Workout session not found.",
        )

    if session.status != "in_progress":
        raise HTTPException(
            status_code=409,
            detail="This workout is not in progress.",
        )

    exercise = (
        db.query(WorkoutExercise)
        .filter(
            WorkoutExercise.id == exercise_id,
            WorkoutExercise.session_id == session.id,
        )
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found.",
        )

    if payload.completed_sets > exercise.planned_sets:
        raise HTTPException(
            status_code=422,
            detail="Completed sets cannot exceed planned sets.",
        )

    exercise.completed_sets = payload.completed_sets

    exercise.is_completed = (
        payload.completed_sets == exercise.planned_sets
    )

    db.commit()
    db.refresh(session)

    return serialize_session(session, db)


# =========================================================
# FINISH WORKOUT + AUTOMATIC CALORIE CALCULATION
# =========================================================

@router.post("/{session_id}/finish")
def finish_workout(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    session = (
        db.query(WorkoutSession)
        .filter(
            WorkoutSession.id == session_id,
            WorkoutSession.user_id == current_user.id,
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Workout session not found.",
        )

    # Prevent duplicate calorie calculations.
    if session.status == "completed":
        return serialize_session(session, db)

    if session.status != "in_progress":
        raise HTTPException(
            status_code=409,
            detail="Workout cannot be finished.",
        )

    exercises = (
        db.query(WorkoutExercise)
        .filter(WorkoutExercise.session_id == session.id)
        .all()
    )

    if not exercises or any(
        exercise.completed_sets != exercise.planned_sets
        for exercise in exercises
    ):
        raise HTTPException(
            status_code=400,
            detail="Complete all planned sets before finishing the workout.",
        )

    weight = getattr(current_user, "weight_kg", None)

    if weight is None:
        raise HTTPException(
            status_code=400,
            detail="Save your profile weight before completing a workout.",
        )

    now = datetime.now(timezone.utc)

    started_at = session.started_at

    if started_at.tzinfo is None:
        started_at = started_at.replace(tzinfo=timezone.utc)

    duration_seconds = (now - started_at).total_seconds()
    duration_minutes = int(duration_seconds // 60)

    if duration_minutes < 1:
        raise HTTPException(
            status_code=400,
            detail="Workout duration must be at least one minute.",
        )

    if duration_minutes > 240:
        raise HTTPException(
            status_code=400,
            detail="Workout duration exceeds four hours. Please review the session.",
        )

    calories = calculate_calories(
        weight_kg=weight,
        duration_minutes=duration_minutes,
        intensity=session.intensity,
    )

    # Use the server's local date for the daily progress record.
    today = date.today()

    progress = (
        db.query(ProgressRecord)
        .filter(
            ProgressRecord.user_id == current_user.id,
            ProgressRecord.date == today,
        )
        .first()
    )

    if progress is None:

        progress = ProgressRecord(
            user_id=current_user.id,
            date=today,
            weight_kg=weight,
            calories_burned=calories,
            steps=0,
            workout_completed=True,
        )

        db.add(progress)

    else:

        progress.calories_burned = (
            (progress.calories_burned or 0) + calories
        )

        progress.workout_completed = True

    session.status = "completed"
    session.completed_at = now
    session.duration_minutes = duration_minutes
    session.calories_burned = calories

    try:
        db.commit()
        db.refresh(session)

    except Exception:
        db.rollback()
        raise

    return serialize_session(session, db)

    
@router.get("/history")
def get_workout_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if limit < 1 or limit > 50:
        raise HTTPException(
            status_code=422,
            detail="Limit must be between 1 and 50.",
        )

    sessions = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.user_id == current_user.id)
        .order_by(WorkoutSession.started_at.desc())
        .limit(limit)
        .all()
    )

    return [
        serialize_session(session, db)
        for session in sessions
    ]
