from pydantic import BaseModel
from datetime import datetime


class BookingCreate(BaseModel):
    user_id: int
    showtime_id: int
    seat_number: str


class BookingResponse(BaseModel):
    id: int
    user_id: int
    showtime_id: int
    seat_number: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True