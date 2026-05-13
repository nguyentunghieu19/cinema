# backend/app/schemas/movie.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MovieBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration: int
    genre: Optional[str] = None
    director: Optional[str] = None
    cast: Optional[str] = None
    release_date: Optional[datetime] = None
    poster_url: Optional[str] = None
    trailer_url: Optional[str] = None
    rating: Optional[float] = 0.0

class MovieCreate(MovieBase):
    pass

class MovieResponse(MovieBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True