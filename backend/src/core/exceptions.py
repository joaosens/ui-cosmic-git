from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse 
from dataclasses import dataclass, field

@dataclass
class GitHubAPIError(Exception): # Handler goes look which's avalaible exception Errors 
    status_code : int = 500

async def global_exception_handler(request: Request, exc: GitHubAPIError): # Handler inject the needed parameters, like body request for parameter type's Request   
    message : str 
    return JSONResponse(
        status_code=500, 
        content={
            "detail": "Ocurred any unexpected internal error"}
    )

async def github_exception_handler(request: Request, exc: GitHubAPIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message
        }
    )