from pydantic import BaseModel

class DonateRequest(BaseModel):
    amount: float
    message: str