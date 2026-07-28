"""
Wholesale schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class WholesaleConfigUpdate(BaseModel):
    """Schema for updating wholesale config (all fields optional)"""
    heading: Optional[str] = None
    description: Optional[str] = None
    cta_heading: Optional[str] = None
    cta_description: Optional[str] = None
    whatsapp_number: Optional[str] = None
    whatsapp_message: Optional[str] = None
    is_active: Optional[bool] = None


class WholesaleConfigResponse(BaseModel):
    """Schema for wholesale config response"""
    id: int
    heading: Optional[str]
    description: Optional[str]
    cta_heading: Optional[str]
    cta_description: Optional[str]
    whatsapp_number: Optional[str]
    whatsapp_message: Optional[str]
    is_active: bool
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class WholesaleSizeCreate(BaseModel):
    """Schema for creating a wholesale size"""
    size_liters: int = Field(..., gt=0, description="Volume in litres")
    sort_order: int = Field(default=0, description="Display order (lower = first)")
    is_active: bool = Field(default=True, description="Whether this size is active")


class WholesaleSizeUpdate(BaseModel):
    """Schema for updating a wholesale size (all fields optional)"""
    size_liters: Optional[int] = Field(None, gt=0)
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class WholesaleSizeResponse(BaseModel):
    """Schema for wholesale size response"""
    id: int
    size_liters: int
    sort_order: int
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
