from sqlalchemy.orm import Session
from app.models.booking import Booking
from app.schemas.booking import BookingCreate


def create_booking(db: Session, booking: BookingCreate):
    new_booking = Booking(**booking.model_dump())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking


def get_bookings(db: Session):
    return db.query(Booking).all()


def delete_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        return None

    db.delete(booking)
    db.commit()
    return booking