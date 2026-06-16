import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from src.core.env import settings 
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext # That's package has an interesting features with mathematic logic for handling passwords 

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
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  
    # The 'bcrypt' scheme is a slow algorithm with a slight delay on purpose to prevent brute-force attacks
    # 'deprecated="auto"' allows switching hashing schemes in the future without breaking compatibility for existing users.
    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)
    def verify_password(self, plain_password: str, # What the user send for can sign in
     hashed_password: str # What is saved in database 
     ) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)