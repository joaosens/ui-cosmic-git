from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.database.models import UserConfig
from src.core.security import verify_token

router = APIRouter()

@router.post("/settings/token")
async def save_token(
    token: str, 
    payload: dict[str, str] = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = payload.get("sub")
    user_config = db.query(UserConfig).filter(UserConfig.user_id == user_id).first() 
    # Querying with Python objects (ORM) prevents SQL injection and catches errors during development.
    if user_config: 
        user_config.git_token = token
        message = "Token updated successfully."
    else: 
        new_config = UserConfig(user_id=user_id, git_token=token)
        db.add(new_config)
        message = "Token saved successfully."
    db.commit()
    return { "message": message}