# backend/app/services/user_service.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
import bcrypt
from typing import Optional
import random
from app.services.email_service import send_verification_email
def get_password_hash(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate) -> User:

    hashed_password = get_password_hash(
        user.password
    )

    code = str(
        random.randint(
            100000,
            999999
        )
    )

    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role="user",
        is_active=True,
        is_verified=False,
        verification_code=code
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    try:
        send_verification_email(
        db_user.email,
        code
    )
    except Exception as e:
        print("Email Error:", e)

    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user
def create_reset_code(
    db: Session,
    email: str
):

    user = get_user_by_email(
        db,
        email
    )

    if not user:
        return False

    code = str(
        random.randint(
            100000,
            999999
        )
    )

    user.verification_code = code

    db.commit()

    send_verification_email(
        email,
        code
    )

    return True


def reset_password(
    db: Session,
    email: str,
    code: str,
    new_password: str
):

    user = get_user_by_email(
        db,
        email
    )

    if not user:
        return False

    if user.verification_code != code:
        return False

    user.password = get_password_hash(
        new_password
    )

    user.verification_code = None

    db.commit()

    return True