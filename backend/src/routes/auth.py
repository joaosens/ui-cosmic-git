from fastapi import APIRouter
from src.core.security import create_access_token

router = APIRouter()

@router.post("/auth/login")
async def login(user_id: str):
    token = create_access_token({"sub": user_id})
    return {"access_token": token, "token_type": "bearer"}