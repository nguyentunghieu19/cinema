from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.services import booking_service

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


@router.post("/", response_model=BookingResponse)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    return booking_service.create_booking(db, booking)


@router.get("/", response_model=list[BookingResponse])
def get_bookings(db: Session = Depends(get_db)):
    return booking_service.get_bookings(db)


@router.delete("/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = booking_service.delete_booking(db, booking_id)

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {"message": "Booking deleted successfully"}