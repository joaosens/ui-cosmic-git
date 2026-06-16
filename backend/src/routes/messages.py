from fastapi import APIRouter, Depends # 'Depends' enforce any parameter call a function before run route
from sqlalchemy.orm import Session
from src.core.security import Token
from src.database.connection import get_db
from src.database.models import Message
from src.schema.messages_schema import MessageCreate, MessageResponse

router = APIRouter()

@router.post("/messages/send", response_model=MessageResponse)
async def send_message(
    data: MessageCreate, 
    payload: dict = Depends(Token.verify_token)):
    db: Session = Depends(get_db)

    user_id=payload.get("sub")
    new_msg = Message(user_id, content=data.content)
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    return {
        "id": new_msg.id,
        "user": user_id,
        "content": new_msg.content,
        "created_at": new_msg.created_at
    }