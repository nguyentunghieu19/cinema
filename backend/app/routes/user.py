from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.services.user_service import (
    create_user,
    authenticate_user,
    get_user_by_email
)
from app.core.security import create_access_token
from app.core.config import settings
from app.models.user import User
from app.schemas.user import VerifyEmailRequest
router = APIRouter(prefix="/api/users", tags=["Users"])

from app.schemas.user import (
    ForgotPasswordRequest,
    ResetPasswordRequest
)

from app.services.user_service import (
    create_reset_code,
    reset_password
)
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    return create_user(db, user)

@router.post("/verify-email")
def verify_email(
    data: VerifyEmailRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.verification_code != data.code:
        raise HTTPException(
            status_code=400,
            detail="Mã xác thực không đúng"
        )

    user.is_verified = True
    user.verification_code = None

    db.commit()

    return {
        "message": "Xác thực thành công"
    }
@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    result = create_reset_code(
        db,
        data.email
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Email không tồn tại"
        )

    return {
        "message": "OTP đã gửi về email"
    }


@router.post("/reset-password")
def reset_password_route(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    result = reset_password(
        db,
        data.email,
        data.code,
        data.new_password
    )

    if not result:
        raise HTTPException(
            status_code=400,
            detail="OTP không đúng"
        )

    return {
        "message": "Đổi mật khẩu thành công"
    }
@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not db_user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Tài khoản chưa xác thực email"
    )
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role
        }
    }