import os
from typing import Optional

class Settings:
    """Application settings and environment configuration"""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # CORS
    FRONTEND_URL: Optional[str] = os.getenv("FRONTEND_URL", None)
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
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

