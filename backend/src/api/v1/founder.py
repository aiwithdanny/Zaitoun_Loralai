"""
Founder API endpoints

Public: GET /api/v1/founder/ → returns active founder
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import Founder
from src.schemas import FounderResponse

router = APIRouter()


@router.get("/", response_model=FounderResponse)
async def get_active_founder(db: Session = Depends(get_db)):
    """Return the first active founder entry."""
    founder = db.query(Founder).filter(Founder.is_active == True).first()  # noqa: E712
    if not founder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No founder information available"
        )
    return founder
