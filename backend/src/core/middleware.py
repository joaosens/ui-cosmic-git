from starlette.types import ASGIApp, Receive, Scope, Send
import time
import logging

from fastapi.responses import JSONResponse
from src.core.redis import redis_client

logger = logging.getLogger(__name__)


class LogRequestsMiddleware:
    """
    Middleware responsible for logging:
    - incoming requests
    - latency
    """

    def __init__(self, app: ASGIApp):
        # Reference to the next ASGI app/middleware
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):

        # Ignore non-HTTP traffic (e.g. WebSockets)
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Start request timer
        start_time = time.time()

        # Log request metadata
        logger.info(
            f"[REQUEST] method={scope['method']} path={scope['path']}"
        )

        # Continue request lifecycle
        await self.app(scope, receive, send)

        # Calculate total request time
        process_time = time.time() - start_time

        logger.info(
            f"[RESPONSE] duration={process_time:.4f}s"
        )


class RateLimitMiddleware:
    """
    Simple Redis-based rate limiter.
    """

    def __init__(
        self,
        app: ASGIApp,
        window: int,
        max_requests: int
    ):
        self.app = app
        self.window = window
        self.max_requests = max_requests

    async def __call__(
        self,
        scope: Scope,
        receive: Receive,
        send: Send
    ):

        # Ignore non-HTTP requests
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Extract client IP from ASGI scope
        client = scope.get("client")
        client_ip = client[0] if client else "unknown"

        # Unique Redis key per client
        key = f"rate_limit:{client_ip}"

        # Increment request counter
        current_requests = await redis_client.incr(key)

        # Set expiration only on first request
        if current_requests == 1:
            await redis_client.expire(key, self.window)

        # Block requests above the allowed limit
        if current_requests > self.max_requests:

            response = JSONResponse(
                status_code=429,
                content={
                    "detail": (
                        "Too many requests"
                    )
                }
            )

            # Send ASGI response manually
            await response(scope, receive, send)
            return

        # Continue normal request flow
        await self.app(scope, receive, send)

"""
    ===> SCOPE PAYLOAD <=== 

    "type": "http",                       - Identifies the protocol type
    "asgi": {"version": "3.0", "spec_version": "2.3"}, - ASGI specification versions
    "http_version": "1.1",                 - HTTP version used (e.g., "1.1", "2")
    "method": "POST",                      - HTTP Method
    "scheme": "https",                     - URL scheme used ("http" or "https")
    "path": "/users/create",               - Decoded URL path string
    "raw_path": b"/users/create",          - Original URL path as raw bytes
    "query_string": b"active=true&id=10",  - Raw query string bytes
    "headers": [                           - List of (key, value) tuples as bytes
        (b"host", b"://example.com"),
        (b"content-type", b"application/json"),
        (b"user-agent", b"Mozilla/5.0...")
    ],
    "client": ("127.0.0.1", 54321),        - Client remote IP and port tuple
    "server": ("10.0.0.5", 443),           - Server listening IP and port tuple
    "app": None,                           - Starlette application instance reference
    "router": None,                        - Starlette internal Router reference
    "path_params": {"id": "10"}            - Path parameters injected after routing


    ===> RECEIVE PAYLOAD <===  

    "type": "http.request",
    "body": b'{"name": "John Doe"}',       - Request body segment as raw bytes
    "more_body": False                     - True if more chunks follow, False if last

    "type": "http.response.start",
    "status": 201,                         - HTTP status code integer
    "headers": [(b"content-type", b"application/json"),  - Response headers as raw bytes tuples
        (b"server", b"uvicorn")]
"""

class SecurityHeadersMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app
    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope['type'] != 'http':
            await self.app(scope, receive, send)
            return 

        async def send_with_headers(message):
            if message['type'] == 'http.response.start':
                headers = dict(message.get('headers', []))
                headers.update({
                    b"x-content-type-options": b"nosniff",
                    # Prevents the browser from guessing (sniffing) the file type, enforcing the declared content-type
                    b"x-frame-options": b"DENY", 
                    # Disables <iframe> rendering of our app on other sites, preventing Clickjacking attacks
                    b"x-xss-protection": b"1; mode=block", 
                    # Legacy header that blocks the page from loading if a Cross-Site Scripting (XSS) attack is detected
                    b"strict-transport-security": b"max-age=63072000; includeSubDomains; preload",
                    # Forces all data to travel exclusively over HTTPS (encrypted connection) for the next 2 years
                    b"content-security-policy": b"default-src 'self'"
                    # Only allows the browser to load resources (scripts, images, styles) originating from our own domain

                })
                message['headers'] = list(headers.items())
            await send(message)

        await self.app(scope, receive, send_with_headers)