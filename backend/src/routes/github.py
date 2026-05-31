from mailbox import Message
from fastapi import APIRouter, Depends, JSONResponse
from pydantic import ValidationError # ValidationError helps with a traceback better
from sqlalchemy.orm import Session
import logging
from src.schema.github_schema import ApiSchema
from src.services.github_analytics import GitHubApi
from src.core.security import verify_token
from src.core.exceptions import GitHubAPIError
from src.database.models import UserConfig 
from src.database.connection import get_db

logger = logging.getLogger(__name__)

router = APIRouter() # APIRouter modularizes HTTP domains and separates route registration

@router.get("/github", response_model=ApiSchema) # response_model integrates Pydantic validation into the request lifecycle, 
# enforcing a typed API contract, automatic serialization, response filtering, and OpenAPI documentation generation.
async def github_stats(
    payload: dict[str, str] = Depends(verify_token),
    db : Session = Depends(get_db)
):
    user_id = payload.get("sub")
    config = db.query(UserConfig).filter(UserConfig.user_id == user_id).first()

    if not config:
        raise GitHubAPIError(status_code=404, message= "Token not found. Configure it first.")
    
    api = GitHubApi(user_token=config.git_token)

    try: 
        return await api.get_github_analysis()
    except ValidationError as ve:
        logger.exception(f"[SCHEMA ERROR] GitHub Data Invalid - {ve.errrors()}")
        raise GitHubAPIError(status_code=502, message="Bad Gateway") # When server receives an invalid response from another server
    except Exception as e:
        logger.exception(f"[ERROR] {e}")
        raise GitHubAPIError(status_code=500, message="Internal Server Error")

