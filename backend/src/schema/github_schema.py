from pydantic import BaseModel 

# Pydantic schemas act as DTOs (Data Transfer Objects), providing typed validation, serialization, and explicit API contracts.
# FastAPI uses these schemas to guarantee response consistency, generate Swagger/OpenAPI documentation automatically,

class Schema(BaseModel):
    
    owner: str

    avatar: str

    followers: list[str]

    latest_repo: str | None

    forks: int

    all_repos: list[str]

    total_repos: int

    total_stars: int

    avg_stars: float

    top_language: str

    top_repos: list[str]

    languages: dict[str, int]