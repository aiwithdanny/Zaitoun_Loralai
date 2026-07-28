"""
Product Accordions API endpoint

Public: GET /api/v1/product-accordions/ → returns active sections ordered by sort_order
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import ProductAccordion

router = APIRouter()


@router.get("/")
async def get_product_accordions(db: Session = Depends(get_db)):
    """Return all active product accordion sections ordered by sort_order."""
    sections = (
        db.query(ProductAccordion)
        .filter(ProductAccordion.is_active == True)  # noqa: E712
        .order_by(ProductAccordion.sort_order)
        .all()
    )
    return [s.to_dict() for s in sections]
