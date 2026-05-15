from fastapi import APIRouter, HTTPException
from pydantic import ValidationError # ValidationError helps with a traceback better
import logging
from src.schema.github_schema import ApiSchema
from src.services.github_analytics import github_api

logger = logging.getLogger(__name__)

router = APIRouter() # APIRouter modularizes HTTP domains and separates route registration

@router.get("/github", response_model=ApiSchema) # response_model integrates Pydantic validation into the request lifecycle, 
# enforcing a typed API contract, automatic serialization, response filtering, and OpenAPI documentation generation.
async def github_stats():
    try:
        data = await github_api.get_github_analysis()
        return data
    except ValidationError as ve:
        logger.exception(f"[SCHEMA ERROR] GitHub Data Invalid - {ve.errrors()}")
        raise HTTPException(status_code=502, detail="Bad Gateway") # When server receives an invalid response from another server
    except Exception as e:
        logger.exception(f"[ERROR] {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")