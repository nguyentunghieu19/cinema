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

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    return create_user(db, user)


@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
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