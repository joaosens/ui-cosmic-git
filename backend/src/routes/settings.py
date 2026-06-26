from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.database.models import UserConfig
from src.core.security import AuthHandler
from src.schema.settings_schema import GitToken

router = APIRouter()

@router.post("/token")
async def save_token(
    data: GitToken, 
    payload: dict[str, str] = Depends(AuthHandler.verify_token),
    db: Session = Depends(get_db)
):
    user_id = payload.get("sub")
    user_config = db.query(UserConfig).filter(UserConfig.user_id == user_id).first() 
    # Querying with Python objects (ORM) prevents SQL injection and catches errors during development.
    if user_config: 
        user_config.git_token = data.git_token
        message = "Token updated successfully." 
    else: 
        new_config = UserConfig(user_id=user_id, git_token=data.git_token)
        db.add(new_config)
        message = "Token saved successfully."
    db.commit()
    return { "message": message}