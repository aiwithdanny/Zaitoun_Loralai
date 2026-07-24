"""
Testimonials API endpoint

Public: GET /api/v1/testimonials/ → returns active testimonials ordered by sort_order
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import Testimonial

router = APIRouter()


@router.get("/")
async def get_testimonials(db: Session = Depends(get_db)):
    """Return all active testimonials ordered by sort_order."""
    testimonials = (
        db.query(Testimonial)
        .filter(Testimonial.is_active == True)  # noqa: E712
        .order_by(Testimonial.sort_order)
        .all()
    )
    return [t.to_dict() for t in testimonials]
