# -*- coding: utf-8 -*-

from fastapi import FastAPI
from src.routes.github import router as github_router
from src.routes.messages import router as messages_router
from src.database.init_db import init_db
from src.database.connection import engine, Base


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