"""
Coupon API endpoints — validate a coupon code (public, read-only)
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from datetime import datetime

from src.models import Coupon
from src.models.database import get_db

router = APIRouter()


class ValidateRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=50)
    cart_total: float = Field(..., gt=0)


@router.post("/validate")
async def validate_coupon(body: ValidateRequest, db: Session = Depends(get_db)):
    """Validate a coupon code and return the discount amount. Does not mutate any data."""

    coupon = db.query(Coupon).filter(Coupon.code == body.code.upper().strip()).first()

    if not coupon:
        return {"valid": False, "message": "Coupon not found"}

    if not coupon.is_active:
        return {"valid": False, "message": "Coupon is no longer active"}

    if coupon.expiry_date and coupon.expiry_date < datetime.utcnow():
        return {"valid": False, "message": "Coupon has expired"}

    if coupon.usage_limit is not None and coupon.times_used >= coupon.usage_limit:
        return {"valid": False, "message": "Coupon usage limit has been reached"}

    if coupon.min_order_amount is not None and body.cart_total < coupon.min_order_amount:
        return {
            "valid": False,
            "message": f"Minimum order amount of Rs. {coupon.min_order_amount:,.0f} required",
        }

    # Calculate discount
    if coupon.discount_type == "percentage":
        discount_amount = body.cart_total * (coupon.discount_value / 100)
        if coupon.max_discount_amount is not None:
            discount_amount = min(discount_amount, coupon.max_discount_amount)
    else:
        discount_amount = min(coupon.discount_value, body.cart_total)

    return {
        "valid": True,
        "discount_type": coupon.discount_type,
        "discount_value": coupon.discount_value,
        "discount_amount": round(discount_amount, 2),
        "message": "Coupon applied successfully",
    }
