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

# CORS Middleware - Restrict to frontend domain only
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],  # Restrict to frontend domain
    allow_credentials=True,
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
from src.api.v1 import products, orders, whatsapp, admin, newsletter

app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(newsletter.router, prefix="/api/v1/newsletter", tags=["Newsletter"])
app.include_router(whatsapp.router, prefix="/api/v1/whatsapp", tags=["WhatsApp"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
