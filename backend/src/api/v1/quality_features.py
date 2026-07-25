"""
Quality Features API endpoint

Public: GET /api/v1/quality-features/ → returns active features ordered by sort_order
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import QualityFeature

router = APIRouter()


@router.get("/")
async def get_quality_features(db: Session = Depends(get_db)):
    """Return all active quality features ordered by sort_order."""
    features = (
        db.query(QualityFeature)
        .filter(QualityFeature.is_active == True)  # noqa: E712
        .order_by(QualityFeature.sort_order)
        .all()
    )
    return [f.to_dict() for f in features]
