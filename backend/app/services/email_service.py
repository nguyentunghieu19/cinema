import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings

EMAIL_ADDRESS = settings.EMAIL_ADDRESS
EMAIL_PASSWORD = settings.EMAIL_PASSWORD



def send_verification_email(
    receiver_email: str,
    code: str
):
    subject = "Cinema - Xác thực tài khoản"

    body = f"""
Mã xác thực của bạn là:

{code}

Mã có hiệu lực trong lần xác thực này.
"""

    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = receiver_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(
        "smtp.gmail.com",
        587
    )

    server.starttls()

    server.login(
        EMAIL_ADDRESS,
        EMAIL_PASSWORD
    )

    server.send_message(msg)

    server.quit()