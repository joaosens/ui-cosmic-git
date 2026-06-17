from pydantic import BaseModel, ConfigDict
from datetime import datetime 

class MessageCreate(BaseModel):

    content: str

class MessageResponse(BaseModel): # Output message to avoid SQL-injection

    id: int

    user: str

    content: str

    created_at: datetime

    model_config = ConfigDict(from_attributes=True) # It's a configuration for Pydantic to get translated data straight from the database