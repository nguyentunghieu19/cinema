import hmac
import hashlib
import urllib.parse
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.showtime import Showtime
from app.models.payment import Payment

from app.core.vnpay_config import (
    VNPAY_TMN_CODE,
    VNPAY_HASH_SECRET,
    VNPAY_PAYMENT_URL,
    VNPAY_RETURN_URL,
)


def create_vnpay_payment(db: Session, booking_id: int):

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        raise ValueError("Booking not found")

    showtime = db.query(Showtime).filter(
        Showtime.id == booking.showtime_id
    ).first()

    if not showtime:
        raise ValueError("Showtime not found")

    amount = int(showtime.price) * 100

    txn_ref = datetime.now().strftime("%Y%m%d%H%M%S")

    create_date = datetime.now().strftime("%Y%m%d%H%M%S")

    order_info = f"Thanh toan ve phim {booking.id}"

    input_data = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": VNPAY_TMN_CODE,
        "vnp_Amount": str(amount),
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": txn_ref,
        "vnp_OrderInfo": order_info,
        "vnp_OrderType": "other",
        "vnp_Locale": "vn",
        "vnp_ReturnUrl": VNPAY_RETURN_URL,
        "vnp_IpAddr": "127.0.0.1",
        "vnp_CreateDate": create_date,
    }

    sorted_data = sorted(input_data.items())

    hash_data = urllib.parse.urlencode(sorted_data)

    secure_hash = hmac.new(
        bytes(VNPAY_HASH_SECRET, "utf-8"),
        bytes(hash_data, "utf-8"),
        hashlib.sha512
    ).hexdigest()

    query = urllib.parse.urlencode(sorted_data)

    payment_url = (
        VNPAY_PAYMENT_URL
        + "?"
        + query
        + "&vnp_SecureHash="
        + secure_hash
    )

    print("HASH DATA:", hash_data)
    print("SECURE HASH:", secure_hash)
    print("PAYMENT URL:", payment_url)

    payment = Payment(
        booking_id=booking.id,
        amount=showtime.price,
        provider="vnpay",
        order_id=txn_ref,
        request_id=txn_ref,
        status="pending",
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "payment_url": payment_url
    }
def verify_vnpay_payment(vnp_params: dict):

    # Lấy hash VNPay gửi về
    vnp_secure_hash = vnp_params.pop(
        "vnp_SecureHash",
        None
    )

    # Xóa field không dùng
    vnp_params.pop(
        "vnp_SecureHashType",
        None
    )

    # Sort params
    sorted_params = sorted(vnp_params.items())

    # VNPay yêu cầu urlencode giống lúc tạo payment
    hash_data = urllib.parse.urlencode(sorted_params)

    print("RETURN HASH DATA:", hash_data)

    # Tạo hash mới
    secure_hash = hmac.new(
        bytes(VNPAY_HASH_SECRET, "utf-8"),
        bytes(hash_data, "utf-8"),
        hashlib.sha512
    ).hexdigest()

    print("RETURN SECURE HASH:", secure_hash)
    print("VNPAY SECURE HASH:", vnp_secure_hash)

    return secure_hash == vnp_secure_hash