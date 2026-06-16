from fastapi import APIRouter, Depends 
from src.core.security import Token
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.database.init_db import init_db
from src.database.models import User
from src.core.security import Password
from src.schema.auth_schema import SignupRequest

init_db()
router = APIRouter()


@router.post("/signup")
async def signup(data: SignupRequest, db: Session = Depends(get_db)):
    print(f"DEBUG: {type(data.password)}")
    print(f"DEBUG: {data.password}")
    hashed_password = Password.get_password_hash(data.password)
    new_user= User(id=data.username, password_hash=hashed_password, email=data.email)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}
@router.post("/login")
async def login(user_id: str):
    token = Token.create_access_token({"sub": user_id})
    return {"access_token": token, "token_type": "bearer"}