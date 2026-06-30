"""
Newsletter subscription API endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime

from src.models.database import get_db
from src.models import NewsletterSubscription

router = APIRouter()


class NewsletterSubscribeRequest(BaseModel):
    """Schema for newsletter subscription"""
    email: EmailStr


class NewsletterSubscribeResponse(BaseModel):
    """Response for newsletter subscription"""
    success: bool
    message: str
    email: str


@router.post("/subscribe", response_model=NewsletterSubscribeResponse)
async def subscribe_newsletter(
    request: NewsletterSubscribeRequest,
    db: Session = Depends(get_db)
):
    """Subscribe email to newsletter - Public endpoint"""

    # Check if email already subscribed
    existing = db.query(NewsletterSubscription).filter(
        NewsletterSubscription.email == request.email,
        NewsletterSubscription.is_active == True
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already subscribed to newsletter"
        )

    # Check if previously unsubscribed
    previous = db.query(NewsletterSubscription).filter(
        NewsletterSubscription.email == request.email
    ).first()

    if previous:
        # Resubscribe
        previous.is_active = True
        previous.unsubscribed_at = None
        previous.subscribed_at = datetime.utcnow()
        db.commit()
        db.refresh(previous)

        return {
            "success": True,
            "message": "Successfully resubscribed to newsletter",
            "email": request.email
        }

    # Create new subscription
    subscription = NewsletterSubscription(
        email=request.email,
        subscribed_at=datetime.utcnow(),
        is_active=True
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return {
        "success": True,
        "message": "Successfully subscribed to newsletter. Check your email for updates!",
        "email": request.email
    }


@router.post("/unsubscribe")
async def unsubscribe_newsletter(
    request: NewsletterSubscribeRequest,
    db: Session = Depends(get_db)
):
    """Unsubscribe email from newsletter - Public endpoint"""

    subscription = db.query(NewsletterSubscription).filter(
        NewsletterSubscription.email == request.email
    ).first()

    if not subscription or not subscription.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not found or already unsubscribed"
        )

    subscription.is_active = False
    subscription.unsubscribed_at = datetime.utcnow()
    db.commit()

    return {
        "success": True,
        "message": "Successfully unsubscribed from newsletter",
        "email": request.email
    }


@router.get("/subscribers")
async def get_subscribers_count(db: Session = Depends(get_db)):
    """Get total active newsletter subscribers - Public endpoint"""
    count = db.query(NewsletterSubscription).filter(
        NewsletterSubscription.is_active == True
    ).count()

    return {
        "success": True,
        "data": {
            "total_subscribers": count
        }
    }
