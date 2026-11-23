from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# =========================================================
# USER PROFILE UPDATE SCHEMA
# =========================================================

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = Field(default=None, ge=13, le=100)
    gender: Optional[str] = None
    height_cm: Optional[float] = Field(default=None, gt=50, lt=250)
    weight_kg: Optional[float] = Field(default=None, gt=20, lt=300)
    goal: Optional[str] = None
    activity_level: Optional[str] = None
    fitness_level: Optional[str] = None
    diet_type: Optional[str] = None


# =========================================================
# GET CURRENT USER PROFILE
# =========================================================

@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


# =========================================================
# UPDATE CURRENT USER PROFILE
# =========================================================

@router.put("/me", response_model=UserResponse)
def update_my_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = user_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user