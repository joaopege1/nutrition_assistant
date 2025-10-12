from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from models import SessionLocal, FoodEntry, User
from .auth import get_current_user
from typing import Annotated
from passlib.context import CryptContext
from pydantic import BaseModel, Field

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserVerification(BaseModel):
    username: str
    password: str = Field(min_length=6)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/", status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    return db.query(User).filter(User.id == user['id']).first()

@router.put("/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    user_data: UserVerification,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    db_user = db.query(User).filter(User.id == user['id']).first()
    if not bcrypt_context.verify(user_data.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Incorrect password")
    new_hashed_password = bcrypt_context.hash(user_data.password)
    db_user.hashed_password = new_hashed_password
    db.commit()
    return {"message": "Password updated successfully"}

