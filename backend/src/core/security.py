import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from src.core.env import settings 
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

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
