"""
Re-export all schemas for backward compatibility.
Route files can still use `from src.schemas import X`.
"""
from src.schemas.common import SuccessResponse, ErrorResponse
from src.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from src.schemas.order import OrderItemData, OrderCreate, OrderStatusUpdate, OrderPaymentUpdate, OrderResponse
from src.schemas.admin import AdminLogin, AdminRegister, AdminResponse, TokenResponse
from src.schemas.whatsapp import WhatsAppMessage, WhatsAppPaymentLink
from src.schemas.customer import CustomerRegister, CustomerLogin, CustomerProfileResponse
from src.schemas.review import ReviewCreate, ReviewResponse, ReviewAggregate
from src.schemas.content import (
    FounderCreate, FounderUpdate, FounderResponse,
    HomepageContentUpdate, HomepageContentResponse,
    StoryContentUpdate, StoryContentResponse,
    RecipeContentUpdate, RecipeContentResponse,
    RecipeCreate, RecipeUpdate, RecipeResponse,
    TestimonialCreate, TestimonialUpdate, TestimonialResponse,
    QualityFeatureCreate, QualityFeatureUpdate, QualityFeatureResponse,
    TastingNoteCreate, TastingNoteUpdate, TastingNoteResponse,
    ProductAccordionCreate, ProductAccordionUpdate, ProductAccordionResponse,
)
from src.schemas.wholesale import (
    WholesaleConfigUpdate, WholesaleConfigResponse,
    WholesaleSizeCreate, WholesaleSizeUpdate, WholesaleSizeResponse,
)
from src.schemas.site import NavLinkItem, SiteConfigUpdate, SiteConfigResponse
