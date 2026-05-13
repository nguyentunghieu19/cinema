# backend/app/db/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    DATABASE_USERNAME: str
    DATABASE_PASSWORD: str
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: str = "1433"
    DATABASE_NAME: str = "cinema"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

# Tạo DATABASE_URL
DATABASE_URL = (
    f"mssql+pyodbc://{settings.DATABASE_USERNAME}:{settings.DATABASE_PASSWORD}@"
    f"{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}"
    "?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False,           # Đổi thành True nếu muốn xem SQL query
    future=True
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()