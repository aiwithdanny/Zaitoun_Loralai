"""
Admin schemas
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


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


class TokenResponse(BaseModel):
    """Response model for login - includes JWT token"""
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse
