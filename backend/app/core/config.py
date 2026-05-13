# backend/app/core/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 ngày

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()