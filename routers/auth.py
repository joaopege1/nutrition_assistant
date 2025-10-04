from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel
from models import User, SessionLocal
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import timedelta, datetime

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
    )

SECRET_KEY = 'ce7dfcb4f4e276661caf69fe3e6505fc122901c0bb4b4b2bd9a0602b49c2cd6d'
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/tokens")

class CreateUser(BaseModel):
    username: str
    email: str
    full_name: str | None = None
    password: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user 

def create_access_token(username: str, user_id: int, expire_delta: timedelta):
    encode = {"sub": username, "id": user_id}
    expire = datetime.utcnow() + expire_delta
    encode.update({"exp": expire})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("id")
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
        return {"username": username, "id": user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUser):
    create_user_model=User(
        email=create_user_request.email,
        full_name=create_user_request.full_name,
        hashed_password=bcrypt_context.hash(create_user_request.password),
        username=create_user_request.username,
        role=create_user_request.role,
        is_active=True
    )
    
    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)

    return {"message": "User created", "user": create_user_request}

@router.post("/tokens", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(user.username, user.id, timedelta(minutes=30))
    return {"access_token": token, "token_type": "bearer"}