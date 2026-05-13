# backend/app/models/showtime.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float, Boolean, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class Showtime(Base):
    __tablename__ = "showtimes"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False, default=0.0)
    theater_room = Column(String(50), nullable=True)      # Phòng chiếu
    available_seats = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship với Movie
    movie = relationship("Movie", backref="showtimes")

    def __repr__(self):
        return f"<Showtime {self.id} - Movie {self.movie_id} at {self.start_time}>"