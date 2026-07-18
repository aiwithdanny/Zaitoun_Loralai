"""
Pydantic schemas for request validation and response serialization
All models include field constraints, type validation, and documentation
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime


# ==================== PRODUCT SCHEMAS ====================

class ProductCreate(BaseModel):
    """Schema for creating a new product"""
    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    description: str = Field(..., min_length=10, description="Product description (min 10 chars)")
    short_description: Optional[str] = Field(None, max_length=500, description="Short description")
    price: float = Field(..., gt=0, description="Product price (must be > 0)")
    discount_price: Optional[float] = Field(None, gt=0, description="Discounted price if applicable")
    stock: int = Field(default=0, ge=0, description="Stock quantity (non-negative)")
    category: Optional[str] = Field(None, max_length=100, description="Product category")
    image_url: Optional[str] = Field(None, max_length=500, description="Product image URL")
    is_featured: bool = Field(default=False, description="Mark as featured product")
    product_group_id: Optional[str] = Field(None, max_length=100, description="Group ID linking size variants of the same product line")
    size_label: Optional[str] = Field(None, max_length=50, description="Display text for size/variant (e.g. 250ml, 500ml, 3L)")

    @validator("discount_price")
    def discount_must_be_less_than_price(cls, v, values):
        if v is not None and "price" in values and v >= values["price"]:
            raise ValueError("Discount price must be less than regular price")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Premium Olive Oil",
                "description": "Extra virgin olive oil from Loralai region",
                "short_description": "Best quality olive oil",
                "price": 25.99,
                "discount_price": 19.99,
                "stock": 100,
                "category": "Oils",
                "image_url": "https://example.com/image.jpg",
                "is_featured": True
            }
        }


class ProductUpdate(BaseModel):
    """Schema for updating a product (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    short_description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    discount_price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = Field(None, ge=1, description="Display order (lower = first)")
    product_group_id: Optional[str] = Field(None, max_length=100, description="Group ID linking size variants")
    size_label: Optional[str] = Field(None, max_length=50, description="Display text for size/variant")

    @validator("discount_price")
    def discount_must_be_less_than_price(cls, v, values):
        if v is not None and "price" in values and values["price"] is not None:
            if v >= values["price"]:
                raise ValueError("Discount price must be less than regular price")
        return v


class ProductResponse(BaseModel):
    """Schema for product response"""
    id: int
    name: str
    slug: str
    description: str
    short_description: Optional[str]
    price: float
    discount_price: Optional[float]
    stock: int
    category: Optional[str]
    image_url: Optional[str]
    is_active: bool
    is_featured: bool
    product_group_id: Optional[str]
    size_label: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== ORDER SCHEMAS ====================

class OrderItemData(BaseModel):
    """Schema for order items"""
    product_id: int = Field(..., gt=0, description="Product ID")
    quantity: int = Field(..., gt=0, description="Quantity (must be > 0)")


class OrderCreate(BaseModel):
    """Schema for creating a new order"""
    customer_name: str = Field(..., min_length=2, max_length=255, description="Customer name")
    customer_email: EmailStr = Field(..., description="Customer email")
    customer_phone: str = Field(..., min_length=10, max_length=20, description="Customer phone number")
    customer_address: str = Field(..., min_length=10, description="Customer address")
    items: List[OrderItemData] = Field(..., min_items=1, description="Order items (minimum 1)")
    payment_method: str = Field(default="whatsapp", description="Payment method")
    coupon_code: Optional[str] = Field(None, max_length=50, description="Coupon code to apply")

    @validator("payment_method")
    def validate_payment_method(cls, v):
        valid_methods = ["whatsapp", "bank_transfer", "card", "cash"]
        if v not in valid_methods:
            raise ValueError(f"Invalid payment method. Valid options: {', '.join(valid_methods)}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "customer_name": "Ahmed Khan",
                "customer_email": "ahmed@example.com",
                "customer_phone": "+923331234567",
                "customer_address": "123 Main St, Loralai, Balochistan",
                "items": [
                    {"product_id": 1, "quantity": 2},
                    {"product_id": 2, "quantity": 1}
                ],
                "payment_method": "whatsapp"
            }
        }


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status"""
    status: str = Field(..., description="Order status")

    @validator("status")
    def validate_status(cls, v):
        valid_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
        if v not in valid_statuses:
            raise ValueError(f"Invalid status. Valid options: {', '.join(valid_statuses)}")
        return v


class OrderPaymentUpdate(BaseModel):
    """Schema for updating payment status"""
    payment_status: str = Field(..., description="Payment status")
    whatsapp_message_id: Optional[str] = Field(None, description="WhatsApp message ID for payment confirmation")

    @validator("payment_status")
    def validate_payment_status(cls, v):
        valid_statuses = ["unpaid", "paid", "refunded"]
        if v not in valid_statuses:
            raise ValueError(f"Invalid payment status. Valid options: {', '.join(valid_statuses)}")
        return v


class OrderResponse(BaseModel):
    """Schema for order response"""
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    total_amount: float
    status: str
    payment_method: str
    payment_status: str
    whatsapp_message_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== ADMIN SCHEMAS ====================

class AdminLogin(BaseModel):
    """Schema for admin login"""
    username: str = Field(..., min_length=3, max_length=100, description="Admin username")
    password: str = Field(..., min_length=6, description="Admin password")

    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin",
                "password": "SecurePassword123"
            }
        }


class AdminRegister(BaseModel):
    """Schema for admin registration"""
    username: str = Field(..., min_length=3, max_length=100, description="Admin username")
    email: EmailStr = Field(..., description="Admin email")
    password: str = Field(..., min_length=8, description="Admin password (min 8 chars for security)")

    @validator("password")
    def password_must_be_strong(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin",
                "email": "admin@zaitoun.com",
                "password": "SecurePassword123"
            }
        }


class AdminResponse(BaseModel):
    """Schema for admin user response"""
    id: int
    username: str
    email: str
    is_admin: bool
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== WHATSAPP SCHEMAS ====================

class WhatsAppMessage(BaseModel):
    """Schema for WhatsApp message sending"""
    phone_number: str = Field(..., min_length=10, max_length=20, description="Recipient phone number")
    message: str = Field(..., min_length=1, max_length=4096, description="Message content")

    class Config:
        json_schema_extra = {
            "example": {
                "phone_number": "+923331234567",
                "message": "Your order ZL-20260626123456 has been confirmed!"
            }
        }


class WhatsAppPaymentLink(BaseModel):
    """Schema for WhatsApp payment link generation"""
    phone_number: str = Field(..., min_length=10, max_length=20, description="Customer phone number")
    amount: float = Field(..., gt=0, description="Payment amount")
    description: str = Field(..., min_length=1, max_length=500, description="Payment description")
    order_number: str = Field(..., description="Order number")

    class Config:
        json_schema_extra = {
            "example": {
                "phone_number": "+923331234567",
                "amount": 50.99,
                "description": "Payment for order ZL-20260626123456",
                "order_number": "ZL-20260626123456"
            }
        }


# ==================== CUSTOMER SCHEMAS ====================

class CustomerRegister(BaseModel):
    """Schema for customer registration"""
    name: str = Field(..., min_length=2, max_length=255, description="Customer full name")
    email: EmailStr = Field(..., description="Customer email")
    phone: str = Field(..., min_length=10, max_length=20, description="Customer phone number")
    password: str = Field(..., min_length=8, description="Password (min 8 chars)")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Ahmed Khan",
                "email": "ahmed@example.com",
                "phone": "+923331234567",
                "password": "SecurePass123"
            }
        }


class CustomerLogin(BaseModel):
    """Schema for customer login"""
    email: EmailStr = Field(..., description="Customer email")
    password: str = Field(..., min_length=1, description="Customer password")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "ahmed@example.com",
                "password": "SecurePass123"
            }
        }


class CustomerProfileResponse(BaseModel):
    """Schema for customer profile response"""
    id: int
    name: str
    email: str
    phone: Optional[str]
    is_active: bool
    created_at: Optional[datetime]
    last_login: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== REVIEW SCHEMAS ====================

class ReviewCreate(BaseModel):
    """Schema for creating a review"""
    rating: int = Field(..., ge=1, le=5, description="Rating 1-5")
    review_text: str = Field(..., min_length=10, max_length=2000, description="Review text (min 10 chars)")
    photo_url: Optional[str] = Field(None, max_length=500, description="Optional review photo URL")


class ReviewResponse(BaseModel):
    """Schema for review response (includes customer_name via join)"""
    id: int
    customer_id: int
    customer_name: Optional[str]
    product_group_id: str
    rating: int
    review_text: str
    photo_url: Optional[str]
    verified_buyer: bool
    is_approved: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ReviewAggregate(BaseModel):
    """Aggregate stats for a product group's reviews"""
    average_rating: float
    total_count: int
    distribution: dict


# ==================== GENERIC RESPONSE SCHEMAS ====================

class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool = True
    message: str = Field(default="Operation completed successfully")


class ErrorResponse(BaseModel):
    """Generic error response"""
    success: bool = False
    detail: str
    error_code: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "detail": "Product not found",
                "error_code": "PRODUCT_NOT_FOUND"
            }
        }
