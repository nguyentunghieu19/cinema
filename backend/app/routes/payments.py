from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db

from app.models.payment import Payment
from app.models.booking import Booking
from app.services.vnpay_service import (
    create_vnpay_payment,
    verify_vnpay_payment,
)

router = APIRouter(
    prefix="/api/payments",
    tags=["Payments"],
)


# ==========================================
# Request Schema
# ==========================================
class VNPayRequest(BaseModel):
    booking_id: int


# ==========================================
# Tạo thanh toán VNPay
# ==========================================
@router.post("/vnpay/create")
def create_vnpay(
    data: VNPayRequest,
    db: Session = Depends(get_db),
):
    try:

        result = create_vnpay_payment(
            db=db,
            booking_id=data.booking_id
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==========================================
# VNPay Return
# ==========================================
@router.get("/vnpay/return")
def vnpay_return(
    request: Request,
    db: Session = Depends(get_db),
):

    vnp_params = dict(request.query_params)

    # Verify chữ ký
    is_valid = verify_vnpay_payment(
        vnp_params.copy()
    )

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid signature"
        )

    txn_ref = vnp_params.get("vnp_TxnRef")

    response_code = vnp_params.get(
        "vnp_ResponseCode"
    )

    payment = db.query(Payment).filter(
        Payment.order_id == txn_ref
    ).first()

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    # =========================
    # Thanh toán thành công
    # =========================
    if response_code == "00":

        payment.status = "success"

        payment.transaction_id = vnp_params.get(
            "vnp_TransactionNo"
        )

        db.commit()

        return {
            "message": "Thanh toán thành công",
            "status": "success"
        }

    # =========================
    # Thanh toán thất bại
    # =========================
    else:

        payment.status = "failed"

        booking = db.query(Booking).filter(
            Booking.id == payment.booking_id
        ).first()

        # Xóa booking để trả ghế về trống
        if booking:
            db.delete(booking)

        db.commit()

        return {
            "message": "Thanh toán thất bại",
            "status": "failed"
        }