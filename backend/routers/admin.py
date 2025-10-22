from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from models import SessionLocal, FoodEntry, User
from .auth import get_current_user
from typing import Annotated
from pydantic import BaseModel

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

class RoleUpdate(BaseModel):
    role: str

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

@router.get("/admin/users/", status_code=status.HTTP_200_OK)
async def get_all_users(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if user['user_role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this resource")
    
    all_users = db.query(User).all()
    return all_users

@router.put("/admin/users/{user_id}/role", status_code=status.HTTP_200_OK)
async def update_user_role(
    user_id: int,
    role_data: RoleUpdate,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    if user['user_role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this resource")
    
    # Verificar se o role é válido
    if role_data.role not in ['user', 'admin']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role. Must be 'user' or 'admin'")
    
    # Buscar o usuário
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Atualizar o role
    target_user.role = role_data.role
    db.commit()
    db.refresh(target_user)
    
    return {"message": "User role updated successfully", "user": {
        "id": target_user.id,
        "username": target_user.username,
        "email": target_user.email,
        "full_name": target_user.full_name,
        "role": target_user.role,
        "is_active": target_user.is_active
    }}