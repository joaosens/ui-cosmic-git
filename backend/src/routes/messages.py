from fastapi import APIRouter, Depends # 'Depends' enforce any parameter call a function before run route
from src.core.security import verify_token
from src.schema.messages_schema import MessageCreate 

router = APIRouter()

@router.post("/messages/send", response_model=MessageCreate)
async def send_message(
    token_payload: dict = Depends(verify_token), 
    data: MessageCreate, 
    payload: dict = Depends(verify_token)):
    user_id = payload.get("sub")

    return {
    "id":1, 
    "user_id": user_id,
    "content": data.content, 
    "created_at": datetime.now()
    }