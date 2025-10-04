from fastapi import FastAPI
from sqlalchemy.ext.declarative import declarative_base
from models import engine
from routers import auth, food

app = FastAPI()
Base = declarative_base()


Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(food.router)
