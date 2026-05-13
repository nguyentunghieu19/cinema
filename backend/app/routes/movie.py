from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas.movie import MovieCreate, MovieResponse
from app.services.movie_service import (
    get_movies,
    get_movie,
    create_movie,
    update_movie,
    delete_movie
)
from app.dependencies.auth import require_admin

router = APIRouter(
    prefix="/api/movies",
    tags=["Movies"]
)

@router.post(
    "/",
    response_model=MovieResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_movie(
    movie: MovieCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return create_movie(db, movie)


@router.get("/", response_model=List[MovieResponse])
def read_movies(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return get_movies(db, skip=skip, limit=limit)


@router.get("/{movie_id}", response_model=MovieResponse)
def read_movie(
    movie_id: int,
    db: Session = Depends(get_db)
):
    movie = get_movie(db, movie_id)

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return movie


@router.put("/{movie_id}", response_model=MovieResponse)
def update_existing_movie(
    movie_id: int,
    movie: MovieCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    updated_movie = update_movie(db, movie_id, movie)

    if not updated_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return updated_movie


@router.delete("/{movie_id}", response_model=MovieResponse)
def delete_existing_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    deleted_movie = delete_movie(db, movie_id)

    if not deleted_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return deleted_movie