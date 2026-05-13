from sqlalchemy import Column, Integer, ForeignKey, String
from app.db.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    showtime_id = Column(Integer, ForeignKey("showtimes.id"))
    seat_number = Column(String(10))