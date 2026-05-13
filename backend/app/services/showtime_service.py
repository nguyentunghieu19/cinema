# backend/app/services/showtime_service.py
from sqlalchemy.orm import Session
from app.models.showtime import Showtime
from app.models.movie import Movie
from app.schemas.showtime import ShowtimeCreate
from typing import List, Optional
from app.models.booking import Booking
def get_showtimes(db: Session, skip: int = 0, limit: int = 100) -> List[Showtime]:
    return db.query(Showtime)\
             .filter(Showtime.is_active == True)\
             .order_by(Showtime.start_time)\
             .offset(skip)\
             .limit(limit)\
             .all()

def get_showtime_by_movie(db: Session, movie_id: int) -> List[Showtime]:
    """Lấy tất cả suất chiếu của một phim"""
    return db.query(Showtime)\
             .filter(Showtime.movie_id == movie_id, Showtime.is_active == True)\
             .order_by(Showtime.start_time)\
             .all()

def get_showtime(db: Session, showtime_id: int) -> Optional[Showtime]:
    return db.query(Showtime)\
             .filter(Showtime.id == showtime_id, Showtime.is_active == True)\
             .first()

def create_showtime(db: Session, showtime: ShowtimeCreate) -> Showtime:
    # Kiểm tra phim tồn tại
    movie = db.query(Movie).filter(Movie.id == showtime.movie_id).first()
    if not movie:
        raise ValueError(f"Movie with id {showtime.movie_id} not found")

    db_showtime = Showtime(
        movie_id=showtime.movie_id,
        start_time=showtime.start_time,
        price=showtime.price,
        theater_room=showtime.theater_room,
        available_seats=showtime.available_seats
    )
    db.add(db_showtime)
    db.commit()
    db.refresh(db_showtime)
    return db_showtime
def delete_showtime(db: Session, showtime_id: int):
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()

    if not showtime:
        return None

    existing_booking = (
        db.query(Booking)
        .filter(Booking.showtime_id == showtime_id)
        .first()
    )

    if existing_booking:
        raise ValueError("Không thể xóa suất chiếu đã có người đặt vé")

    db.delete(showtime)
    db.commit()

    return showtime
def update_showtime(db: Session, showtime_id: int, showtime_data: ShowtimeCreate):
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()

    if not showtime:
        return None

    for key, value in showtime_data.model_dump().items():
        setattr(showtime, key, value)

    db.commit()
    db.refresh(showtime)

    return showtime