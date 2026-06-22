from pydantic import BaseModel

class GitToken(BaseModel):
    git_token: str