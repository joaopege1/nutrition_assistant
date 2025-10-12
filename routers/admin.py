from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from models import SessionLocal, FoodEntry, User
from .auth import get_current_user
from typing import Annotated

router = APIRouter(
    prefix="/auth",
    tags=["admin"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/admin/foods/", status_code=status.HTTP_200_OK)
async def Get_All_Food_Entries(user: user_dependency, 
                                 db: db_dependency
                                 ):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if user['user_role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this resource")
    all_food_entries = db.query(FoodEntry).all()
    return all_food_entries

@router.delete("/admin/food_entry/{food_entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_food_entry(
    food_entry_id: int,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if user['user_role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this resource")
    food_entry = db.query(FoodEntry).filter(FoodEntry.id == food_entry_id).first()
    if not food_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food entry not found")
    db.delete(food_entry)
    db.commit()
    return {"message": "Food entry deleted"}

@router.put("/admin/food_entry/{food_entry_id}", status_code=status.HTTP_200_OK)
async def update_food_entry(
    food_entry_id: int,
    is_safe: bool,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if user['user_role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this resource")
    food_entry = db.query(FoodEntry).filter(FoodEntry.id == food_entry_id).first()
    if not food_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food entry not found")
    food_entry.is_safe = is_safe
    db.commit()
    db.refresh(food_entry)
    return {"message": "Food entry updated", "food_entry": {
        "id": food_entry.id,
        "user": food_entry.user,
        "food": food_entry.food,
        "quantity": food_entry.quantity,
        "is_safe": food_entry.is_safe
    }}