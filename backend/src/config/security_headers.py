"""
Security response headers for every HTTP response.

Adds defense-in-depth headers at the ASGI layer so they apply to ALL
responses, including those from exception handlers, rate-limit 429s,
and the outer CORS wrapper:

  - X-Content-Type-Options: nosniff   (stop MIME sniffing)
  - X-Frame-Options: DENY             (block clickjacking)
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: geolocation=(), microphone=(), camera=()  (restrict browser features)
  - Strict-Transport-Security: max-age (HTTPS-only; production only —
    browsers refuse HSTS on plain HTTP localhost, which breaks dev)

HSTS is skipped when DEBUG is truthy so local development on http stays
functional; it is always sent when the request arrived over https.
"""

import os
from starlette.types import ASGIApp, Receive, Scope, Send

_HSTS_MAX_AGE = "63072000"  # 2 years
_HSTS = "max-age={0}; includeSubDomains; preload".format(_HSTS_MAX_AGE)

# (header_name, value) added to every response
_STATIC_HEADERS = (
    (b"x-content-type-options", b"nosniff"),
    (b"x-frame-options", b"DENY"),
    (b"referrer-policy", b"strict-origin-when-cross-origin"),
    (b"permissions-policy", b"geolocation=(), microphone=(), camera=()"),
)


def _debug_enabled() -> bool:
    return os.getenv("DEBUG", "").lower() in ("true", "1", "yes")


class SecurityHeadersMiddleware:
    """Pure ASGI middleware injecting security headers on every response."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        async def send_with_headers(message: dict) -> None:
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                existing = {h[0] for h in headers}
                for name, value in _STATIC_HEADERS:
                    if name not in existing:
                        headers.append((name, value))
                # HSTS only when safe (https in use) — never on dev http.
                if b"strict-transport-security" not in existing:
                    scheme = scope.get("scheme", "")
                    if scheme == "https" or not _debug_enabled():
                        headers.append(
                            (b"strict-transport-security", _HSTS.encode())
                        )
                message["headers"] = headers
            await send(message)

        await self.app(scope, receive, send_with_headers)
