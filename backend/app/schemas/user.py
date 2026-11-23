from pydantic import BaseModel, EmailStr, ConfigDict
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
    fitness_level: str
    diet_type: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


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
    fitness_level: str
    diet_type: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)