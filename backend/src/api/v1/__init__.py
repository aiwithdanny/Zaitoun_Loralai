"""
API v1 module for Zaitoun Loralai
"""

from fastapi import APIRouter

from src.api.v1 import products, orders, whatsapp, admin, wishlist

router = APIRouter()

# Include all version 1 routers
router.include_router(products.router, prefix="/products", tags=["Products"])
router.include_router(orders.router, prefix="/orders", tags=["Orders"])
router.include_router(whatsapp.router, prefix="/whatsapp", tags=["WhatsApp"])
router.include_router(admin.router, prefix="/admin", tags=["Admin"])
router.include_router(wishlist.router, prefix="/wishlist", tags=["Wishlist"])

__all__ = ["router", "products", "orders", "whatsapp", "admin", "wishlist"]
