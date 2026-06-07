import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

def send_verification_email(receiver_email: str, code: str):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": receiver_email}],
        sender={"name": "Cinema Booking", "email": "nguyenhieu190405@gmail.com"},
        subject="Cinema - Xác thực tài khoản",
        text_content=f"Mã xác thực của bạn là: {code}\n\nMã có hiệu lực trong lần xác thực này."
    )

    try:
        api_instance.send_transac_email(email)
    except ApiException as e:
        print("Email Error:", e)