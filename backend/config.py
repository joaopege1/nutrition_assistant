import os
import secrets
from typing import Optional

class Settings:
    """Application settings and environment configuration"""

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    # JWT Authentication
    # In production SECRET_KEY MUST come from the environment. In development we
    # generate an ephemeral one per process so dev tokens never share a default.
    SECRET_KEY: str = os.getenv("SECRET_KEY") or (
        secrets.token_hex(32) if os.getenv("ENVIRONMENT", "development") != "production" else ""
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # CORS
    FRONTEND_URL: Optional[str] = os.getenv("FRONTEND_URL", None)

    def __init__(self) -> None:
        if self.ENVIRONMENT == "production" and not self.SECRET_KEY:
            raise RuntimeError(
                "SECRET_KEY environment variable must be set in production"
            )
    
    @property
    def allowed_origins(self) -> list:
        """Get allowed CORS origins based on environment"""
        if self.ENVIRONMENT == "production":
            origins = []
            if self.FRONTEND_URL:
                origins.append(self.FRONTEND_URL)
                # Also allow https version
                if self.FRONTEND_URL.startswith("http://"):
                    origins.append(self.FRONTEND_URL.replace("http://", "https://"))
            return origins
        else:
            # Development origins
            return [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174"
            ]

settings = Settings()

