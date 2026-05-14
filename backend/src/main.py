from fastapi import FastAPI
from src.routes.github import router as github_router
import logging

logger = logging.getLogger(__name__)

app = FastAPI() 

@app.get("/")
async def root(): 
    return {
        "message":"Server running"
    } 
@app.include_router(github_router)