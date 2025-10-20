from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.declarative import declarative_base
from models import engine
from routers import auth, food, admin, users
from config import settings

app = FastAPI(
    title="RCU App API",
    description="API for RCU Application",
    version="1.0.0"
)
Base = declarative_base()

# Configure CORS with environment-aware origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router)
app.include_router(food.router)
app.include_router(admin.router)
app.include_router(users.router)

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to RCU App API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}