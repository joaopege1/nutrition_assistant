from fastapi import Depends, APIRouter, status, HTTPException
from pydantic import BaseModel, Field
import datetime
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from models import SessionLocal, FoodEntry, User
from .auth import get_current_user
from typing import Annotated

router = APIRouter()
Base = declarative_base()

class Item(BaseModel):
    user: str
    food: str
    quantity: int = Field(gt=0)
    is_safe: bool
    date: datetime.datetime

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/foods/")
async def Get_Info_From_Database(user: user_dependency, 
                                 db: Session = Depends(lambda: SessionLocal())
                                 ):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if not db.query(User).filter(User.id == user['id']).first():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    food_entries = db.query(FoodEntry).all()
    return food_entries


@router.post("/food_entry/", status_code=status.HTTP_201_CREATED)
async def create_food_entry(
    user: user_dependency,
    Item: Item,
    db: Session = Depends(lambda: SessionLocal())
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if not db.query(User).filter(User.id == user['id']).first():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    food_entry = FoodEntry(
        user=Item.user,
        food=Item.food,
        quantity=Item.quantity,
        is_safe=Item.is_safe,
    )
    db.add(food_entry)
    db.commit()
    db.refresh(food_entry)


    return {"message": "Food entry created", "food_entry": Item}

@router.delete("/food_entry/{food_entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_food_entry(
    user: user_dependency,
    food_entry_id: int,
    db: Session = Depends(lambda: SessionLocal())
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if not db.query(User).filter(User.id == user['id']).first():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    food_entry = db.query(FoodEntry).filter(FoodEntry.id == food_entry_id).first()
    if food_entry is None:
        return {"message": "Food entry not found"}
    db.delete(food_entry)
    db.commit()
    return {"message": "Food entry deleted"}

@router.put("/food_entry/{food_entry_id}", status_code=status.HTTP_200_OK)
async def update_food_entry(
    user: user_dependency,
    food_entry_id: int,
    Item: Item,
    db: Session = Depends(lambda: SessionLocal())
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if not db.query(User).filter(User.id == user['id']).first():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    food_entry = db.query(FoodEntry).filter(FoodEntry.id == food_entry_id).first()
    if food_entry is None:
        return {"message": "Food entry not found"}
    food_entry.user = Item.user
    food_entry.food = Item.food
    food_entry.quantity = Item.quantity
    food_entry.is_safe = Item.is_safe
    db.commit()
    db.refresh(food_entry)
    return {"message": "Food entry updated", "food_entry": Item}
