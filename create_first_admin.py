"""
Endpoint temporário para criar o primeiro usuário admin
⚠️ REMOVER ESTE ARQUIVO APÓS USAR!
"""
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models import User, SessionLocal
from passlib.context import CryptContext

router = APIRouter(tags=["setup"])
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
            username="joaopege",
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

