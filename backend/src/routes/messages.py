from fastapi import APIRouter, Depends # 'Depends' enforce any parameter call a function before run route
from sqlalchemy.orm import Session
from datetime import datetime
from src.core.security import AuthService as AS
from src.database.connection import get_db
from src.database.models import Message
from src.schema.messages_schema import MessageCreate, MessageResponse

router = APIRouter()

@router.post("/messages/send", response_model=MessageResponse)
async def send_message(
    data: MessageCreate, 
    payload: dict = Depends(AS.verify_token)):
    db: Session = Depends(get_db)
    
    new_msg = Message(user_id=payload.get("sub"), content=data.content)
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    return {
        "status": "saved",
        "id": new_msg.id
    }