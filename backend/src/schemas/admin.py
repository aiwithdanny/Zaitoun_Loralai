"""
Admin schemas
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime

from src.config.auth import validate_password_strength


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

    @field_validator("password")
    @classmethod
    def password_must_be_strong(cls, v):
        validate_password_strength(v)
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
