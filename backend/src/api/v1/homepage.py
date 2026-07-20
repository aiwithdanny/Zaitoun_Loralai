"""
Homepage Content API endpoints

Public: GET /api/v1/homepage/ → returns active homepage content
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import HomepageContent
from src.schemas import HomepageContentResponse

router = APIRouter()


@router.get("/", response_model=HomepageContentResponse)
async def get_active_homepage(db: Session = Depends(get_db)):
    """Return the first active homepage content entry."""
    content = db.query(HomepageContent).filter(HomepageContent.is_active == True).first()  # noqa: E712
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No homepage content available"
        )
    return content
