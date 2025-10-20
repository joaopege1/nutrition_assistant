"""
Endpoints temporários para gerenciar admin
⚠️ REMOVER ESTE ARQUIVO APÓS USAR!
"""
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models import User, SessionLocal
from passlib.context import CryptContext
from pydantic import BaseModel

router = APIRouter(tags=["setup"])
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ResetPassword(BaseModel):
    username: str
    new_password: str

@router.post("/create-first-admin")
async def create_first_admin():
    """
    ⚠️ ENDPOINT TEMPORÁRIO - Criar primeiro admin
    Este endpoint deve ser REMOVIDO após o uso!
    """
    db = SessionLocal()
    try:
        # Verificar se já existe algum admin
        existing_admin = db.query(User).filter(User.role == "admin").first()
        if existing_admin:
            raise HTTPException(
                status_code=400, 
                detail=f"Admin já existe! Username: {existing_admin.username}, ID: {existing_admin.id}"
            )
        
        # Criar o primeiro admin
        admin = User(
            username="joaopege.admin",
            email="joaopege@gmail.com",
            full_name="Administrador",
            hashed_password=bcrypt_context.hash("lanternaverde22"),
            role="admin",
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        return {
            "message": "✅ Admin criado com sucesso! REMOVA ESTE ENDPOINT AGORA!",
            "user": {
                "id": admin.id,
                "username": admin.username,
                "email": admin.email,
                "role": admin.role
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")
    finally:
        db.close()

@router.get("/list-users")
async def list_users():
    """
    ⚠️ ENDPOINT TEMPORÁRIO - Listar todos os usuários
    """
    db = SessionLocal()
    try:
        users = db.query(User).all()
        return {
            "total": len(users),
            "users": [
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role,
                    "is_active": user.is_active
                }
                for user in users
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")
    finally:
        db.close()

@router.post("/reset-password")
async def reset_password(data: ResetPassword):
    """
    ⚠️ ENDPOINT TEMPORÁRIO - Resetar senha de usuário
    """
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == data.username).first()
        if not user:
            raise HTTPException(status_code=404, detail=f"Usuário '{data.username}' não encontrado")
        
        # Atualizar a senha
        user.hashed_password = bcrypt_context.hash(data.new_password)
        db.commit()
        db.refresh(user)
        
        return {
            "message": f"✅ Senha do usuário '{data.username}' resetada com sucesso!",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")
    finally:
        db.close()

