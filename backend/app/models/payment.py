from sqlalchemy import Column, Integer, ForeignKey, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)

    amount = Column(Float, nullable=False)

    provider = Column(String(20), default="momo")

    order_id = Column(String(100), unique=True, nullable=False)
    request_id = Column(String(100), unique=True, nullable=False)

    transaction_id = Column(String(100), nullable=True)

    status = Column(String(20), default="pending")
    # pending | success | failed | cancelled

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Payment {self.order_id} - {self.status}>"