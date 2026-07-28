"""
Order schemas
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime


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
