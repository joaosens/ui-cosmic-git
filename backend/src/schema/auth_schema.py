from pydantic import BaseModel, EmailStr
from typing import Optional

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    
class LoginRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str