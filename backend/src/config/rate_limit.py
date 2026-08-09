"""
Rate limiting for login endpoints (brute-force protection).

Uses the `limits` library (a slowapi dependency) with an in-memory
moving-window limiter. Wired into the app's middleware stack in
src/main.py.

Rules:
  - POST /api/v1/admin/login     -> 5 per minute per client IP
  - POST /api/v1/customers/login -> 5 per minute per client IP

The client IP honors X-Forwarded-For (set by Cloudflare) and falls back
to the direct peer address. On exceeding the limit the middleware returns
429 with Retry-After, before the login handler runs.
"""

from limits import parse
from limits.storage import MemoryStorage
from limits.strategies import MovingWindowRateLimiter
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send

LOGIN_LIMIT = "5/minute"

_storage = MemoryStorage()
_limiter = MovingWindowRateLimiter(_storage)
_limit = parse(LOGIN_LIMIT)

# Paths that this middleware rate-limits (login endpoints).
_LIMITED_PATHS = (
    "/api/v1/admin/login",
    "/api/v1/customers/login",
)

_RESPONSE_BODY = (
    b'{"success":false,"error_code":"RATE_LIMITED",'
    b'"detail":"Too many login attempts. Please try again later."}'
)


def _client_ip(request: Request) -> str:
    """Return the real client IP, honoring X-Forwarded-For (first entry)."""
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


class RateLimitMiddleware:
    """Pure ASGI middleware enforcing login rate limits per client IP.

    Works with the app's outer-ASGI-wrapper layout: it intercepts the
    request before the nested FastAPI router runs, so it does not depend
    on route-handler introspection.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope)

        path = request.url.path
        if request.method == "POST" and path in _LIMITED_PATHS:
            key = _client_ip(request)
            if not _limiter.hit(_limit, key):
                window = _limiter.get_window_stats(_limit, key)[1]
                headers = [
                    (b"content-type", b"application/json"),
                    (b"retry-after", str(max(int(window), 1)).encode()),
                    (b"cache-control", b"no-store"),
                ]
                response = JSONResponse(
                    status_code=429,
                    content={
                        "success": False,
                        "error_code": "RATE_LIMITED",
                        "detail": "Too many login attempts. Please try again later.",
                    },
                    headers={
                        "Retry-After": str(max(int(window), 1)),
                        "Cache-Control": "no-store",
                    },
                )
                await response(scope, receive, send)
                return

        await self.app(scope, receive, send)
