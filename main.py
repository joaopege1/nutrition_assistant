from fastapi import Depends, FastAPI, HTTPException, status
from authenticator import get_current_user
from typing import Annotated
from pydantic import BaseModel
import datetime
from sqlalchemy.orm import Session
from models import User
from database import SessionLocal
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

app = FastAPI()

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
        @app.post("/token")
    async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
        db = SessionLocal()
        user = get_user(db, form_data.username)
        if not user:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        hashed_password = fake_hash_password(form_data.password)
        if not hashed_password == user.hashed_password:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        return {"access_token": user.username, "token_type": "bearer"}
today = datetime.datetime.now()

class Item(BaseModel):
    user: str
    food: str
    quantity: int
    is_safe: bool
    date: datetime.datetime = today


@app.get("/")
async def read_root(current_user: Annotated[str, Depends(get_current_user)]):
    current_user = await get_current_user(item.user)

    all_food_entries = []
    db = next(get_db())
    entries = db.query(FoodEntry).filter(FoodEntry.user == current_user).all()
    for entry in entries:
        all_food_entries.append({
            "id": entry.id,
            "user": entry.user,
            "food": entry.food,
            "quantity": entry.quantity,
            "is_safe": entry.is_safe,
            "date": entry.date
        })
    return all_food_entries

@app.post("/food/")
async def create_item(item: Item):
    current_user = await get_current_user(item.user)
    
    if item.user != current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You can only create items for yourself",
        )
    food_entry = {
        "user": item.user,
        "food": item.food,
        "quantity": item.quantity,
        "is_safe": item.is_safe,
        "date": item.date
    }
    db = next(get_db())
    db.add(FoodEntry(**food_entry))
    db.commit()
    db.refresh(food_entry)

    return food_entry