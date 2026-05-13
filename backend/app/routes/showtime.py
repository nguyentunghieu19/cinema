from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas.showtime import ShowtimeCreate, ShowtimeResponse
from app.services.showtime_service import (
    get_showtimes,
    get_showtime_by_movie,
    get_showtime,
    create_showtime,
    update_showtime,
    delete_showtime
)
from app.dependencies.auth import require_admin

router = APIRouter(prefix="/api/showtimes", tags=["Showtimes"])


@router.post("/", response_model=ShowtimeResponse, status_code=status.HTTP_201_CREATED)
def create_new_showtime(
    showtime: ShowtimeCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    try:
        return create_showtime(db, showtime)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/", response_model=List[ShowtimeResponse])
def read_showtimes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return get_showtimes(db, skip=skip, limit=limit)


@router.get("/movie/{movie_id}", response_model=List[ShowtimeResponse])
def read_showtimes_by_movie(
    movie_id: int,
    db: Session = Depends(get_db)
):
    return get_showtime_by_movie(db, movie_id)


@router.get("/{showtime_id}", response_model=ShowtimeResponse)
def read_showtime(
    showtime_id: int,
    db: Session = Depends(get_db)
):
    showtime = get_showtime(db, showtime_id)

    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")

    return showtime

@router.put("/{showtime_id}", response_model=ShowtimeResponse)
def update_existing_showtime(
    showtime_id: int,
    showtime: ShowtimeCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    updated_showtime = update_showtime(db, showtime_id, showtime)

    if not updated_showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")

    return updated_showtime
@router.delete("/{showtime_id}", response_model=ShowtimeResponse)
def delete_existing_showtime(
    showtime_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    try:
        deleted_showtime = delete_showtime(db, showtime_id)

        if not deleted_showtime:
            raise HTTPException(status_code=404, detail="Showtime not found")

        return deleted_showtime

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))