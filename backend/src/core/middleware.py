import time
import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.core.redis import redis_client
from src.routes.github import router as github_router

logger = logging.getLogger(__name__)

app = FastAPI()

RATE_LIMIT_WINDOW = 300
MAX_REQUESTS = 1

@app.middleware("http")
async def log_requests(request, call_next):

    # Starts latency timer before endpoint execution.
    start_time = time.time()

    logger.info(
        f"[REQUEST] "
        f"method={request.method} "
        f"path={request.url.path}"
    )

    # Continues request lifecycle through routes/middlewares.
    response = await call_next(request)

    # Calculates total backend processing time.
    process_time = time.time() - start_time

    logger.info(
        f"[RESPONSE] "
        f"status={response.status_code} "
        f"duration={process_time:.4f}s"
    )

    return response

async def rate_limit(request, call_next):

    client_ip = request.client.host

    key = f"rate_limit:{client_ip}" # Only key

    current_requests = await redis_client.incr(key) # Yet we don't put a value to key, for your pattern INCR will be equals 1

    if current_requests == 1:
        await redis_client.expire(
            key,
            RATE_LIMIT_WINDOW)

    if current_requests > MAX_REQUESTS:
        return JSONResponse(
            status_code=429, 
            content={"detail":"You can only send one message every five minutes."})
    return await call_next(request)

# CORS system security intermediarium between browser and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173" # Allow fetchs of any slugs
    ],
    allow_credentials=True, # Allow cookies, session tokens and authorization headers
    allow_methods=["*"], # Allow all methods HTTP
    allow_headers=["*"] # Allow all payload Headers
)

# Registers GitHub routes into application.
app.include_router(github_router)