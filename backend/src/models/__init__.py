"""
Database models for Zaitoun Loralai

Re-exports all models from domain-specific files.
Route files can still use `from src.models import X`.
"""

from .database import Base, get_db, SessionLocal, engine
from .product import Product
from .order import Order, OrderItem
from .customer import Customer
from .admin import AdminUser
from .content import (
    NewsletterSubscription,
    Founder, HomepageContent, StoryContent,
    RecipeContent, Recipe,
    Testimonial, QualityFeature, TastingNote,
    ProductAccordion,
)
from .review import Review
from .wishlist import Wishlist
from .coupon import Coupon
from .wholesale import WholesaleConfig, WholesaleSize
from .site import SiteConfig

__all__ = [
    "Base", "get_db", "SessionLocal", "engine",
    "Product", "Order", "OrderItem",
    "AdminUser", "Customer",
    "NewsletterSubscription",
    "Review", "Wishlist", "Coupon",
    "Founder", "HomepageContent", "StoryContent",
    "RecipeContent", "Recipe",
    "Testimonial", "QualityFeature", "TastingNote",
    "ProductAccordion",
    "WholesaleConfig", "WholesaleSize",
    "SiteConfig",
]
