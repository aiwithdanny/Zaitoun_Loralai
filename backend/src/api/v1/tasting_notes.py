"""
Tasting Notes API endpoint

Public: GET /api/v1/tasting-notes/ → returns active notes ordered by sort_order
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import TastingNote

router = APIRouter()


@router.get("/")
async def get_tasting_notes(db: Session = Depends(get_db)):
    """Return all active tasting notes ordered by sort_order."""
    notes = (
        db.query(TastingNote)
        .filter(TastingNote.is_active == True)  # noqa: E712
        .order_by(TastingNote.sort_order)
        .all()
    )
    return [n.to_dict() for n in notes]
