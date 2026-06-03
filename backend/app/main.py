from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.db.database import Base, engine

# Import routers
from app.routes import (
    user,
    movie,
    showtime,
    booking,
    admin,
    upload,
)

# Import models để SQLAlchemy tạo bảng
from app.models import user as user_model
from app.models import movie as movie_model
from app.models import showtime as showtime_model
from app.models import booking as booking_model
from app.models import payment as payment_model
from app.routes import payments

app = FastAPI()

# =========================
# Tạo thư mục uploads/posters nếu chưa tồn tại
# =========================
os.makedirs("uploads/posters", exist_ok=True)

# =========================
# Mount thư mục uploads để truy cập ảnh qua URL
# Ví dụ:
# http://127.0.0.1:8000/uploads/posters/abc.jpg
# =========================
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Tạo bảng database
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# Include routers
# =========================
app.include_router(user.router)
app.include_router(movie.router)
app.include_router(showtime.router)
app.include_router(booking.router)
app.include_router(admin.router)
app.include_router(upload.router)
app.include_router(payments.router)
# =========================
# Test API
# =========================
@app.get("/")
def home():
    return {"message": "Cinema API is running"}