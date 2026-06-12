import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from src.core.env import settings 
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext

class Token:
    security = HTTPBearer() #Implements "Authorization: Bearer {TOKEN}" in header

    def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> Optional[Dict[str, Any]]:
        token = credentials.credentials #It's token, and 'credentials.scheme' is format that's 'Bearer'. 
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError: #If Signature made by own JWS's Server expires enter in this Exception
            raise HTTPException(status_code=403, detail="Expired Token")
        except jwt.InvalidTokenError: #If hasn't Authorization Bearer in Header, or Token Invalid enter in this Exception
            raise HTTPException(status_code=403, detail="Invalid Token")

    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM) # Returns a string in base64 format among 'header(base64) + payload(base64) + signature(hashed via algorithm)'

class Password:
    pwd_context = CryptContext