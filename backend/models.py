from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use environment variable for database URL, fallback to SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# For PostgreSQL on Render, we need to replace 'postgres://' with 'postgresql://'
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine with appropriate settings
engine_kwargs = {"connect_args": {"check_same_thread": False}} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
metadata = Base.metadata

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String)

class FoodEntry(Base):
    __tablename__ = "food_entries"
    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, index=True)
    food = Column(String, index=True)
    quantity = Column(Integer)
    is_safe = Column(Boolean)
    date = Column(DateTime)
    owner_id = Column(Integer, ForeignKey("users.id"))

Base.metadata.create_all(bind=engine)