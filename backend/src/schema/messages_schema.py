from pydantic import BaseModel 
from datetime import datetime 

class MessageCreate(BaseModel):

    content: str

class MessageResponse(BaseModel): # Output message to avoid SQL-injection

    id: int

    user: str

    content: str

    created_at: datetime

    class Config:
        from_attributes = True