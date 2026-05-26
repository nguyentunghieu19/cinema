from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.booking import Booking
from app.models.payment import Payment

from app.schemas.booking import (
    BookingCreate,
    BookingResponse
)

router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings"]
)


# =========================
# Tạo booking
# =========================
@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db)
):

    existing_booking = db.query(Booking).filter(
        Booking.showtime_id == booking.showtime_id,
        Booking.seat_number == booking.seat_number
    ).first()

    if existing_booking:
        raise HTTPException(
            status_code=400,
            detail="Ghế đã được đặt"
        )

    new_booking = Booking(
        user_id=booking.user_id,
        showtime_id=booking.showtime_id,
        seat_number=booking.seat_number
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking


# =========================
# Lấy booking đã thanh toán
# =========================
@router.get("/", response_model=list[BookingResponse])
def get_bookings(
    db: Session = Depends(get_db)
):

    bookings = (
        db.query(Booking)
        .join(
            Payment,
            Payment.booking_id == Booking.id
        )
        .filter(
            Payment.status == "success"
        )
        .all()
    )

    return bookings