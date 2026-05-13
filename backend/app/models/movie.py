# backend/app/models/movie.py
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=False)
    genre = Column(String(100), nullable=True)
    director = Column(String(100), nullable=True)        # ← Đã sửa
    cast = Column(String(500), nullable=True)
    release_date = Column(DateTime, nullable=True)
    poster_url = Column(String(500), nullable=True)
    trailer_url = Column(String(500), nullable=True)
    rating = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Movie {self.title}>"