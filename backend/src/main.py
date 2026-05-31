# -*- coding: utf-8 -*-

from fastapi import FastAPI
from src.core.exceptions import global_exception_handler
from src.routes.github import router as github_router
from src.routes.messages import router as messages_router
from src.database.init_db import init_db
from src.database.connection import engine, Base
from src.core.exceptions import GitHubAPIError, github_exception_handler, DatabaseError, database_exception_handler, global_exception_handler


import logging

logger = logging.getLogger(__name__)
init_db()

app = FastAPI(title="Github Pipeline API") 

@app.get("/")
async def root(): 
    return {                                            
        "message":"Server running"
    } 

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.include_router(github_router)
app.include_router(messages_router)
app.add_exception_handler(GitHubAPIError, github_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(DatabaseError, database_exception_handler)