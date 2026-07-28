"""
Admin API endpoints with JWT authentication

Splits the monolithic admin.py into domain-specific files.
The parent router aggregates all sub-routers.
"""

from fastapi import APIRouter

from src.api.v1.admin.auth import router as auth_router
from src.api.v1.admin.dashboard import router as dashboard_router
from src.api.v1.admin.reviews import router as reviews_router
from src.api.v1.admin.coupons import router as coupons_router
from src.api.v1.admin.cms import router as cms_router
from src.api.v1.admin.uploads import router as uploads_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(dashboard_router)
router.include_router(reviews_router)
router.include_router(coupons_router)
router.include_router(cms_router)
router.include_router(uploads_router)
