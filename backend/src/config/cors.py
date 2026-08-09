"""
CORS origin allowlist — single source of truth for the whole app.

The allowlist is built from:
  1. Known production frontend domains (hardcoded here — these are public URLs)
  2. FRONTEND_URL env var (per-environment override, e.g. a Vercel preview branch)
  3. CORS_ORIGINS env var (comma-separated extras)

There is deliberately NO "*" fallback: an origin that is not on the allowlist
gets no Access-Control-Allow-Origin header, so browsers block the response.

Localhost is included so the SPA can talk to the API during development.
"""

import os

# Public production frontend domains (match frontend/artifacts/zaitoun-loralai/index.html)
PRODUCTION_FRONTEND_ORIGINS = [
    "https://zaitoun-loralai-1mtz.vercel.app",
    "https://zaitounloralai.com",
    "https://www.zaitounloralai.com",
]

# Local dev origins
DEV_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]


def _normalize(origin: str) -> str:
    return origin.strip().rstrip("/")


def build_cors_origins() -> list[str]:
    """Return the full list of allowed origins (no duplicates)."""
    origins: list[str] = []
    for o in PRODUCTION_FRONTEND_ORIGINS + DEV_ORIGINS:
        o = _normalize(o)
        if o and o not in origins:
            origins.append(o)

    fe_url = os.getenv("FRONTEND_URL", "").strip()
    if fe_url:
        fe_url = _normalize(fe_url)
        if fe_url and fe_url not in origins:
            origins.append(fe_url)

    extra = os.getenv("CORS_ORIGINS", "").strip()
    if extra:
        for origin in extra.split(","):
            origin = _normalize(origin)
            if origin and origin not in origins:
                origins.append(origin)

    return origins


def is_origin_allowed(origin: str) -> bool:
    """Return True if the request Origin is on the allowlist.

    Requests with no Origin header (same-origin, curl, server-to-server)
    are treated as allowed — CORS only applies to cross-origin browser calls.
    """
    if not origin:
        return True
    return _normalize(origin) in build_cors_origins()
