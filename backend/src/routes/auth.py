from fastapi import APIRouter, Depends 
from fastapi.exceptions import HTTPException
from src.core.security import AuthHandler
from sqlalchemy.orm import Session
from sqlalchemy import or_
from src.database.connection import get_db
from src.database.init_db import init_db
from src.database.models import User
from src.core.security import Password
from src.schema.auth_schema import SignupRequest, LoginRequest

init_db()
router = APIRouter()


@router.post("/signup")
async def signup(data: SignupRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(or_(User.id == data.username, User.email == data.email)).first()
    if user:
        raise HTTPException(status_code=400, detail="Username or Email already taken")
    hashed_password = Password.get_password_hash(data.password)
    new_user= User(id=data.username, password_hash=hashed_password, email=data.email)
    db.add(new_user)
    db.commit()
    token = AuthHandler.create_access_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"}
@router.post("/login")
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    if not data.username and data.email:
        raise HTTPException(status_code=400, detail="You must provide either username or email")
    if data.username:
        user = db.query(User).filter(User.id == data.username).first()
    else:
        user = db.query(User).filter(User.email == data.email).first()
    if not user or not Password.verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = AuthHandler.create_access_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"} # This will be storage in 'localstorage' 

