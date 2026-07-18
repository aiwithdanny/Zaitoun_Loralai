"""
Wishlist API endpoints — customer-only: add, remove, list
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from pydantic import BaseModel
from datetime import datetime

from src.models import Wishlist, Product
from src.models.database import get_db
from src.config.auth import get_current_customer

router = APIRouter()


class WishlistAddRequest(BaseModel):
    product_group_id: str


@router.post("/")
async def add_to_wishlist(
    body: WishlistAddRequest,
    payload: dict = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    """Add a product group to the customer's wishlist. Requires customer JWT."""

    customer_id = payload.get("customer_id")

    # Check if already wishlisted
    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.customer_id == customer_id,
            Wishlist.product_group_id == body.product_group_id,
        )
        .first()
    )
    if existing:
        return {"success": True, "message": "Already in wishlist"}

    wishlist = Wishlist(
        customer_id=customer_id,
        product_group_id=body.product_group_id,
        created_at=datetime.utcnow(),
    )

    db.add(wishlist)
    db.commit()

    return {"success": True, "message": "Added to wishlist"}


@router.delete("/{product_group_id}")
async def remove_from_wishlist(
    product_group_id: str,
    payload: dict = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    """Remove a product group from the customer's wishlist. Requires customer JWT."""

    customer_id = payload.get("customer_id")

    wishlist = (
        db.query(Wishlist)
        .filter(
            Wishlist.customer_id == customer_id,
            Wishlist.product_group_id == product_group_id,
        )
        .first()
    )
    if not wishlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in wishlist",
        )

    db.delete(wishlist)
    db.commit()

    return {"success": True, "message": "Removed from wishlist"}


@router.get("/")
async def get_wishlist(
    payload: dict = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    """Get the customer's wishlist with full product data. Requires customer JWT."""

    customer_id = payload.get("customer_id")

    wishlist_items = (
        db.query(Wishlist)
        .filter(Wishlist.customer_id == customer_id)
        .order_by(Wishlist.created_at.desc())
        .all()
    )

    if not wishlist_items:
        return {"success": True, "data": []}

    # Fetch all products belonging to wishlisted groups
    group_ids = [w.product_group_id for w in wishlist_items]
    products = (
        db.query(Product)
        .filter(
            Product.product_group_id.in_(group_ids),
            Product.is_active == True,
        )
        .all()
    )

    # Group by product_group_id
    groups: dict[str, list[dict]] = {}
    for p in products:
        gid = p.product_group_id
        if gid:
            if gid not in groups:
                groups[gid] = []
            groups[gid].append(p.to_dict())

    return {"success": True, "data": list(groups.values())}
