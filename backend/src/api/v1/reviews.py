"""
Review API endpoints — public read, customer submit + upload, admin moderation
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import Optional

from src.models import Review, Customer, Order, OrderItem, Product
from src.models.database import get_db
from src.config.auth import get_current_customer, get_current_user
from src.config.cloudinary import upload_image
from src.schemas import ReviewCreate

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB


def _compute_aggregate(product_group_id: str, db: Session) -> dict:
    """Compute aggregate rating stats for a product group's approved reviews."""
    stats = (
        db.query(
            func.count(Review.id).label("total"),
            func.coalesce(func.avg(Review.rating), 0).label("avg"),
        )
        .filter(
            Review.product_group_id == product_group_id,
            Review.is_approved == True,
        )
        .first()
    )
    # Distribution: count per rating level (1-5)
    distribution = {i: 0 for i in range(1, 6)}
    rows = (
        db.query(Review.rating, func.count(Review.id))
        .filter(
            Review.product_group_id == product_group_id,
            Review.is_approved == True,
        )
        .group_by(Review.rating)
        .all()
    )
    for rating, cnt in rows:
        distribution[rating] = cnt

    return {
        "average_rating": round(float(stats.avg), 1),
        "total_count": stats.total,
        "distribution": distribution,
    }


def _is_verified_buyer(customer_id: int, product_group_id: str, db: Session) -> bool:
    """Check if a customer has a completed order containing any product in this group."""
    return (
        db.query(Order)
        .join(OrderItem)
        .join(Product)
        .filter(
            Order.customer_id == customer_id,
            Order.status.in_(["confirmed", "delivered"]),
            Product.product_group_id == product_group_id,
        )
        .first()
        is not None
    )


# ─── PUBLIC ENDPOINTS ───────────────────────────────────────────────


@router.get("/{product_group_id}")
async def get_reviews(product_group_id: str, db: Session = Depends(get_db)):
    """Get approved reviews + aggregate stats for a product group. Public."""
    reviews = (
        db.query(Review)
        .filter(
            Review.product_group_id == product_group_id,
            Review.is_approved == True,
        )
        .order_by(Review.created_at.desc())
        .all()
    )

    aggregate = _compute_aggregate(product_group_id, db)

    return {
        "success": True,
        "data": [r.to_dict() for r in reviews],
        "aggregate": aggregate,
    }


# ─── CUSTOMER-AUTHENTICATED ENDPOINTS ───────────────────────────────


@router.post("/{product_group_id}")
async def create_review(
    product_group_id: str,
    body: ReviewCreate,
    payload: dict = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    """Submit a review for a product group. Requires customer JWT.
    One review per customer per product group.
    verified_buyer is auto-set by checking order history."""

    customer_id = payload.get("customer_id")

    # Check for existing review
    existing = (
        db.query(Review)
        .filter(
            Review.customer_id == customer_id,
            Review.product_group_id == product_group_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already reviewed this product.",
        )

    # Auto-detect verified buyer status
    verified = _is_verified_buyer(customer_id, product_group_id, db)

    review = Review(
        customer_id=customer_id,
        product_group_id=product_group_id,
        rating=body.rating,
        review_text=body.review_text,
        photo_url=body.photo_url,
        verified_buyer=verified,
        is_approved=False,
        created_at=datetime.utcnow(),
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "success": True,
        "data": review.to_dict(),
        "message": "Review submitted for approval.",
    }


@router.post("/upload-image")
async def upload_review_image(
    file: UploadFile = File(...),
    payload: dict = Depends(get_current_customer),
):
    """Upload a review photo to Cloudinary. Requires customer JWT.
    Accepted formats: JPEG, PNG, WebP. Max size: 5MB."""

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Allowed: {', '.join(sorted(ALLOWED_TYPES))}",
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large ({len(file_bytes) / 1024 / 1024:.1f}MB). Maximum: 5MB.",
        )

    try:
        url = upload_image(file_bytes, file.filename or "review.jpg")
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    return {
        "success": True,
        "url": url,
        "message": "Image uploaded successfully",
    }
