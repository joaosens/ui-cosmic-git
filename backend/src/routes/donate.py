from fastapi import APIRouter, Depends
from src.core.security import AuthHandler
from src.schema.donate_schema import DonateRequest
from src.core.env import settings
from src.core.exceptions import MercadoPagoError
import mercadopago

router = APIRouter()

@router.post("/donate")
async def create_donation(
    data: DonateRequest,
    payload: dict = Depends(AuthHandler.verify_token)):
    sdk = mercadopago.SDK(settings.ACCESS_TOKEN_MERCADOPAGO)

    preference_data = {
        "items": [
            {
                "title": "Donate to project", # Name of product that will appears at screen Mercado Pago
                "quantity": 1, 
                "unit_price": data.amount,
            }],
        "back_urls": {
            "success": "http://127.0.0.1:8000/success", # Where must be redirects user after your payment
            "failure": "http://127.0.0.1:8000/failure"
            }
        }
    try: 
        result = sdk.preference().create(preference_data) # Send the contract
        preference = result["response"]
        return {"init_point": preference["init_point"]} # Redirects user to payment page's Mercado Pago
    except Exception as e:
        raise MercadoPagoError(status_code=400, message=f"Mercado Pago Error: {str(e)}")