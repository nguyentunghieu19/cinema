from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class AdminUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "staff"   # user | staff | admin


class AdminUserUpdate(BaseModel):
    name: str
    email: EmailStr
    role: str


class AdminUserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True