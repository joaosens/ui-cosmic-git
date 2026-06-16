from fastapi import APIRouter, Depends 
from src.core.security import Token
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.database.init_db import init_db

init_db()
router = APIRouter()


@router.post("/auth/signup")
async def signup(username, password, email, db: Session = Depends(get_db)):
    db.add(username, password, email)
    db.commit()
@router.post("/auth/login")
async def login(user_id: str):
    token = Token.create_access_token({"sub": user_id})
    return {"access_token": token, "token_type": "bearer"}