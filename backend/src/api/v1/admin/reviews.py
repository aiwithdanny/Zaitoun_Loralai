"""
Admin review moderation endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, selectinload
from datetime import datetime

from src.models import Review
from src.models.database import get_db
from src.config.auth import get_current_user

router = APIRouter()


@router.get("/reviews")
async def list_reviews(
    status: str = "pending",
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all reviews with optional status filter. Admin only."""
    query = db.query(Review).options(selectinload(Review.customer))

    if status == "pending":
        query = query.filter(Review.is_approved == False, Review.review_text != "__rejected__")
    elif status == "approved":
        query = query.filter(Review.is_approved == True)
    elif status == "rejected":
        query = query.filter(Review.review_text == "__rejected__")

    reviews = query.order_by(Review.created_at.desc()).all()
    return {"success": True, "data": [r.to_dict() for r in reviews], "count": len(reviews)}


@router.put("/reviews/{review_id}/approve")
async def approve_review(
    review_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Approve a review. Admin only."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_approved = True
    review.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(review)

    return {"success": True, "data": review.to_dict(), "message": "Review approved."}


@router.put("/reviews/{review_id}/reject")
async def reject_review(
    review_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Reject a review. Admin only."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_approved = False
    review.review_text = "__rejected__"
    review.verified_buyer = False
    review.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(review)

    return {"success": True, "data": review.to_dict(), "message": "Review rejected."}


@router.delete("/reviews/{review_id}")
async def delete_review(
    review_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Permanently delete a review. Admin only."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()

    return {"success": True, "message": "Review permanently deleted."}
