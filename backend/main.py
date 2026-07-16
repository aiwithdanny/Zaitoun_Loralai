"""
Zaitoun Loralai - FastAPI Backend
Premium Olive Oil E-commerce API
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import exception handlers
from src.exceptions import (
    ZaitounException,
    zaitoun_exception_handler,
    validation_exception_handler,
    generic_exception_handler
)

# Create FastAPI app
app = FastAPI(
    title="Zaitoun Loralai API",
    description="Premium Olive Oil E-commerce API with WhatsApp Payment Integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware - Allow configured origins + wildcard fallback
# FRONTEND_URL and CORS_ORIGINS env vars allow explicit Vercel/production domains.
# "*" is kept as fallback so the API works from any deployment preview.
def _build_cors_origins():
    origins = ["*"]
    # Add explicit frontend URL if set
    fe_url = os.getenv("FRONTEND_URL", "").strip()
    if fe_url and fe_url not in origins:
        origins.append(fe_url)
    # Add any comma-separated CORS_ORIGINS (for Vercel previews, custom domains, etc.)
    extra = os.getenv("CORS_ORIGINS", "").strip()
    if extra:
        for origin in extra.split(","):
            origin = origin.strip()
            if origin and origin not in origins:
                origins.append(origin)
    return origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=_build_cors_origins(),
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register exception handlers
app.add_exception_handler(ZaitounException, zaitoun_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring"""
    return {
        "status": "healthy",
        "service": "zaitoun-loralai-api",
        "version": "1.0.0",
        "timestamp": os.environ.get("BUILD_TIME", "unknown")
    }


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Zaitoun Loralai API",
        "documentation": "/docs",
        "health": "/health"
    }


# Import and include routers
from src.api.v1 import products, orders, whatsapp, admin, newsletter, customers, upload, reviews

app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(newsletter.router, prefix="/api/v1/newsletter", tags=["Newsletter"])
app.include_router(whatsapp.router, prefix="/api/v1/whatsapp", tags=["WhatsApp"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["Customers"])
app.include_router(upload.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["Reviews"])
