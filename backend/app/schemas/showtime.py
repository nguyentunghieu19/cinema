# backend/app/schemas/showtime.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ShowtimeBase(BaseModel):
    movie_id: int
    start_time: datetime
    price: float
    theater_room: Optional[str] = None
    available_seats: Optional[int] = 100

class ShowtimeCreate(ShowtimeBase):
    pass

class ShowtimeResponse(ShowtimeBase):
    id: int
    is_active: bool
    created_at: datetime
    # Thêm thông tin phim để dễ hiển thị
    movie_title: Optional[str] = None

    class Config:
        from_attributes = True