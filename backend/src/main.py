# -*- coding: utf-8 -*-

from fastapi import FastAPI
from src.core.exceptions import global_exception_handler
from src.routes.github import router as github_router
from src.routes.messages import router as messages_router
from src.routes.auth import router as auth_router 
from src.routes.settings import router as settings_router 
from src.routes.donate import router as donate_router
from src.database.init_db import init_db
from src.database.connection import engine, Base
from src.core.exceptions import GitHubAPIError, github_exception_handler, DatabaseError, database_exception_handler, MercadoPagoError, mercadopago_exception_handler, global_exception_handler
from src.core.middleware import SecurityHeadersMiddleware, RateLimitMiddleware, LogRequestsMiddleware

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

# Include Routers
app.include_router(github_router)
app.include_router(messages_router, prefix="/messages")
app.include_router(auth_router, prefix="/auth")
app.include_router(settings_router, prefix="/settings")
app.include_router(donate_router)

# Exception Handlers
app.add_exception_handler(GitHubAPIError, github_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(DatabaseError, database_exception_handler)
app.add_exception_handler(MercadoPagoError, mercadopago_exception_handler)

# Middleware
app.add_middleware(LogRequestsMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, window=600, max_requests=7, protected_paths=["/login"])
app.add_middleware(RateLimitMiddleware, window=1800, max_requests=50, protected_paths=["/github"])
app.add_middleware(RateLimitMiddleware, window=300, max_requests=3, protected_paths=["/messages/send"])
