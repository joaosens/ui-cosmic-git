from fastapi import Request
from fastapi.responses import JSONResponse 
from dataclasses import dataclass

@dataclass
class GitHubAPIError(Exception): # Handler goes look which's avalaible exception Errors 
    message : str 
    status_code : int = 500

async def global_exception_handler(request: Request, exc: GitHubAPIError): # Handler inject the needed parameters, like body request for parameter type's Request   
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

@dataclass
class DatabaseError(Exception):
    message: str
    status_code: int = 500

async def database_exception_handler(request: Request, exc=DatabaseError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail":exc.message
        }
    )

