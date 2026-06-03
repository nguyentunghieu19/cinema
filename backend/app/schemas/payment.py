from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PaymentCreateRequest(BaseModel):
    booking_id: int


class PaymentCreateResponse(BaseModel):
    pay_url: str
    order_id: str


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: float
    provider: str
    order_id: str
    request_id: str
    transaction_id: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True