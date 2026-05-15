from pydantic import BaseModel
from datetime import datetime 

# Pydantic schemas act as DTOs (Data Transfer Objects), providing typed validation, serialization, and explicit API contracts.
# FastAPI uses these schemas to guarantee response consistency, generate Swagger/OpenAPI documentation automatically,

class ApiSchema(BaseModel):
    
    owner: str

    avatar: str

    followers: list[str]

    latest_repo: str

    forks: int

    all_repos: list[str]

    total_repos: int

    total_stars: int

    avg_stars: float

    top_language: str

    top_repos: list[str]

    languages: dict[str, int]

class MessageCreate(BaseModel):

    user: str

    content: str

class MessageResponse(BaseModel): # Output message to avoid SQL-injection

    id: int

    user: str

    content: str

    created_at: datetime