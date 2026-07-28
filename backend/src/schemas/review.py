"""
Review schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


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
