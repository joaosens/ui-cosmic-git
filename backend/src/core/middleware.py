import time
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes.github import router as github_router

logger = logging.getLogger(__name__)

app = FastAPI()

@app.middleware("http")
async def log_requests(request, call_next):

    start_time = time.time()

    logger.info(
        f"[REQUEST]"
        f"Method = {request.method}"
        f"Path = {request.url.path}"
    )

    response = await call_next(request)

    process_time = time.time() - start_time

    logger.info(
        f"[RESPONSE]"
        f"Status = {response.status_code}"
        f"Duration = {process_time:.4f}s"
    )
    return response

app.middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

