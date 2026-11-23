from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.models.progress import ProgressRecord
from app.schemas.progress import ProgressCreate, ProgressUpdate, ProgressResponse

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post("", response_model=ProgressResponse)
def create_progress(
    progress_data: ProgressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create today's or a historical progress record, or update an existing one."""
    data = progress_data.model_dump()

    record = (
        db.query(ProgressRecord)
        .filter(
            ProgressRecord.user_id == current_user.id,
            ProgressRecord.date == progress_data.date,
        )
        .first()
    )

    if record:
        for field, value in data.items():
            setattr(record, field, value)
    else:
        record = ProgressRecord(
            user_id=current_user.id,
            **data,
        )
        db.add(record)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{progress_date}", response_model=ProgressResponse)
def update_daily_progress(
    progress_date: date,
    progress_data: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update only supplied fields, preserving the other daily values."""
    record = (
        db.query(ProgressRecord)
        .filter(
            ProgressRecord.user_id == current_user.id,
            ProgressRecord.date == progress_date,
        )
        .first()
    )

    if record is None:
        # Use the user's saved profile weight to initialize a new daily record.
        profile_weight = getattr(current_user, "weight_kg", None)

        if profile_weight is None:
            raise HTTPException(
                status_code=400,
                detail="Please save your weight in your profile before recording daily progress.",
            )

        record = ProgressRecord(
            user_id=current_user.id,
            date=progress_date,
            weight_kg=profile_weight,
            calories_consumed=None,
            calories_burned=0,
            steps=0,
            workout_completed=False,
        )
        db.add(record)

    # Only change fields the client actually supplied.
    changes = progress_data.model_dump(exclude_unset=True)

    for field, value in changes.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.get("", response_model=list[ProgressResponse])
def get_progress_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(ProgressRecord)
        .filter(ProgressRecord.user_id == current_user.id)
        .order_by(ProgressRecord.date.desc())
        .all()
    )


@router.get("/latest", response_model=ProgressResponse)
def get_latest_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(ProgressRecord)
        .filter(ProgressRecord.user_id == current_user.id)
        .order_by(ProgressRecord.date.desc())
        .first()
    )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="No progress records found.",
        )

    return record