"""
Admin coupon management endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from src.models import Coupon
from src.models.database import get_db
from src.config.auth import get_current_user

router = APIRouter()


@router.get("/coupons")
async def get_coupons(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all coupons. Admin only."""
    coupons = db.query(Coupon).order_by(Coupon.created_at.desc()).all()
    return {"success": True, "data": [c.to_dict() for c in coupons]}


@router.post("/coupons")
async def create_coupon(
    data: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new coupon. Admin only."""
    code = data.get("code", "").upper().strip()
    existing = db.query(Coupon).filter(Coupon.code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail="A coupon with this code already exists")

    coupon = Coupon(
        code=code,
        discount_type=data.get("discount_type", "percentage"),
        discount_value=data.get("discount_value", 0),
        min_order_amount=data.get("min_order_amount"),
        max_discount_amount=data.get("max_discount_amount"),
        expiry_date=data.get("expiry_date"),
        usage_limit=data.get("usage_limit"),
        times_used=0,
        is_active=data.get("is_active", True),
        created_at=datetime.utcnow(),
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)

    return {"success": True, "data": coupon.to_dict(), "message": "Coupon created successfully"}


@router.put("/coupons/{coupon_id}")
async def update_coupon(
    coupon_id: int,
    data: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a coupon. Admin only."""
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    updateable_fields = [
        "discount_type", "discount_value", "min_order_amount",
        "max_discount_amount", "expiry_date", "usage_limit", "is_active",
    ]
    for field in updateable_fields:
        if field in data:
            setattr(coupon, field, data[field])

    if "code" in data:
        coupon.code = data["code"].upper().strip()

    db.commit()
    db.refresh(coupon)

    return {"success": True, "data": coupon.to_dict(), "message": "Coupon updated successfully"}


@router.delete("/coupons/{coupon_id}")
async def delete_coupon(
    coupon_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a coupon. Admin only."""
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    db.delete(coupon)
    db.commit()

    return {"success": True, "message": "Coupon deleted successfully"}
