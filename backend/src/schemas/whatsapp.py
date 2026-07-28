"""
WhatsApp schemas
"""

from pydantic import BaseModel, Field
from typing import Optional


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
