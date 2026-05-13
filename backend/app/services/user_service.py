# backend/app/services/user_service.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
import bcrypt
from typing import Optional

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
    """Create new user with hashed password"""
    hashed_password = get_password_hash(user.password)
    
    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role="user",
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user