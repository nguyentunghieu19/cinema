from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.models.user import User
from app.models.movie import Movie
from app.models.booking import Booking
from app.models.showtime import Showtime

from app.schemas.admin_user import (
    AdminUserCreate,
    AdminUserUpdate,
    AdminUserResponse,
)

from app.services.auth_service import require_admin
from app.services.user_service import (
    get_password_hash,
    get_user_by_email,
)
router = APIRouter(prefix="/api/admin", tags=["Admin"])


# =========================================================
# Dashboard Stats
# =========================================================
@router.get("/stats")
def get_admin_stats(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    total_movies = db.query(Movie).count()
    total_showtimes = db.query(Showtime).count()
    total_users = db.query(User).count()
    total_bookings = db.query(Booking).count()

    # Tính tổng doanh thu
    total_revenue = (
        db.query(func.sum(Showtime.price))
        .join(Booking, Booking.showtime_id == Showtime.id)
        .scalar()
        or 0
    )

    # Thống kê số phim có booking
    movie_stats = (
        db.query(Movie.id)
        .join(Showtime, Showtime.movie_id == Movie.id)
        .join(Booking, Booking.showtime_id == Showtime.id)
        .distinct()
        .all()
    )

    return {
        "total_movies": total_movies,
        "total_showtimes": total_showtimes,
        "total_users": total_users,
        "total_bookings": total_bookings,
        "total_revenue": total_revenue,
        "movie_stats": movie_stats,
    }


# =========================================================
# All Bookings
# =========================================================
@router.get("/bookings")
def get_admin_bookings(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(Booking).all()


# =========================================================
# All Users
# =========================================================
@router.get(
    "/users",
    response_model=list[AdminUserResponse],
)
def get_admin_users(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(User.id.desc()).all()


# =========================================================
# Create User / Staff / Admin
# =========================================================
@router.post(
    "/users",
    response_model=AdminUserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_user(
    user: AdminUserCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=get_password_hash(user.password),
        role=user.role,
        is_active=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================================================
# Update User
# =========================================================
@router.put(
    "/users/{user_id}",
    response_model=AdminUserResponse,
)
def update_admin_user(
    user_id: int,
    user_data: AdminUserUpdate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # Không cho admin tự hạ quyền chính mình
    if user.id == admin.id and user_data.role != "admin":
        raise HTTPException(
            status_code=400,
            detail="You cannot remove your own admin role",
        )

    # Kiểm tra email trùng
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email, User.id != user_id)
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    user.name = user_data.name
    user.email = user_data.email
    user.role = user_data.role

    db.commit()
    db.refresh(user)

    return user


# =========================================================
# Delete User
# =========================================================
@router.delete("/users/{user_id}")
def delete_admin_user(
    user_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # Không cho xóa chính mình
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}