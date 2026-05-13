# backend/app/services/movie_service.py
from sqlalchemy.orm import Session
from app.models.movie import Movie
from app.schemas.movie import MovieCreate
from typing import List, Optional

def get_movies(db: Session, skip: int = 0, limit: int = 100) -> List[Movie]:
    """Lấy danh sách phim có phân trang + sắp xếp theo id giảm dần"""
    return db.query(Movie)\
             .filter(Movie.is_active == True)\
             .order_by(Movie.id.desc())\
             .offset(skip)\
             .limit(limit)\
             .all()

def get_movie(db: Session, movie_id: int) -> Optional[Movie]:
    """Lấy thông tin một phim theo ID"""
    return db.query(Movie)\
             .filter(Movie.id == movie_id, Movie.is_active == True)\
             .first()

def create_movie(db: Session, movie: MovieCreate) -> Movie:
    """Tạo phim mới"""
    db_movie = Movie(
        title=movie.title,
        description=movie.description,
        duration=movie.duration,
        genre=movie.genre,
        director=movie.director,
        cast=movie.cast,
        release_date=movie.release_date,
        poster_url=movie.poster_url,
        trailer_url=movie.trailer_url,
        rating=movie.rating or 0.0,
        is_active=True
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def update_movie(db: Session, movie_id: int, movie: MovieCreate) -> Optional[Movie]:
    """Cập nhật thông tin phim"""
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if db_movie:
        db_movie.title = movie.title
        db_movie.description = movie.description
        db_movie.duration = movie.duration
        db_movie.genre = movie.genre
        db_movie.director = movie.director
        db_movie.cast = movie.cast
        db_movie.release_date = movie.release_date
        db_movie.poster_url = movie.poster_url
        db_movie.trailer_url = movie.trailer_url
        db_movie.rating = movie.rating or 0.0
        db.commit()
        db.refresh(db_movie)
    return db_movie

def delete_movie(db: Session, movie_id: int) -> Optional[Movie]:
    """Soft delete phim"""
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if db_movie:
        db_movie.is_active = False
        db.commit()
        db.refresh(db_movie)
    return db_movie