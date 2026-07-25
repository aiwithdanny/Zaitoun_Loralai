"""
Wholesale API endpoint

Public: GET /api/v1/wholesale/ → returns config + active sizes ordered by sort_order
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import WholesaleConfig, WholesaleSize

router = APIRouter()


@router.get("/")
async def get_wholesale(db: Session = Depends(get_db)):
    """Return active wholesale config and sizes."""
    config = (
        db.query(WholesaleConfig)
        .filter(WholesaleConfig.is_active == True)  # noqa: E712
        .first()
    )
    sizes = (
        db.query(WholesaleSize)
        .filter(WholesaleSize.is_active == True)  # noqa: E712
        .order_by(WholesaleSize.sort_order)
        .all()
    )
    return {
        "config": config.to_dict() if config else None,
        "sizes": [s.to_dict() for s in sizes],
    }
