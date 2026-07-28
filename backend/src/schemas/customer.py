"""
Customer schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


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
