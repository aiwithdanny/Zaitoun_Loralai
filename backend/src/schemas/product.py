"""
Product schemas
"""

from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


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
    product_group_id: Optional[str] = Field(None, max_length=100, description="Group ID linking size variants")
    size_label: Optional[str] = Field(None, max_length=50, description="Display text for size/variant")

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
