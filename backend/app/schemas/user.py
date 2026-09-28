from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    goal: str
    activity_level: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    goal: str
    activity_level: str
    created_at: datetime

    class Config:
        from_attributes = True