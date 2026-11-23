from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class ProgressCreate(BaseModel):
    date: date
    weight_kg: float = Field(gt=20, lt=300)
    calories_consumed: Optional[float] = Field(default=None, ge=0)
    calories_burned: Optional[float] = Field(default=None, ge=0)
    steps: Optional[int] = Field(default=None, ge=0)
    workout_completed: bool = False
    notes: Optional[str] = None

class ProgressUpdate(BaseModel):
    weight_kg: Optional[float] = Field(default=None, gt=20, lt=300)
    calories_consumed: Optional[float] = Field(default=None, ge=0)
    calories_burned: Optional[float] = Field(default=None, ge=0)
    steps: Optional[int] = Field(default=None, ge=0)
    workout_completed: Optional[bool] = None
    notes: Optional[str] = None


class ProgressResponse(BaseModel):
    id: int
    date: date
    weight_kg: float
    calories_consumed: Optional[float]
    calories_burned: Optional[float]
    steps: Optional[int]
    workout_completed: bool
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True