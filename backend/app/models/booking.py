from app.db.database import Base
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    showtime_id = Column(
        Integer,
        ForeignKey("showtimes.id")
    )

    seat_number = Column(
        String(10)
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )