import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

def send_verification_email(receiver_email: str, code: str):
    resend.Emails.send({
        "from": "Cinema <onboarding@resend.dev>",
        "to": receiver_email,
        "subject": "Cinema - Xác thực tài khoản",
        "text": f"Mã xác thực của bạn là: {code}\n\nMã có hiệu lực trong lần xác thực này."
    })