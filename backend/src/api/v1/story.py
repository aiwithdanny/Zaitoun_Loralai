"""
Story Content API endpoints

Public: GET /api/v1/story/ → returns active story content
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import StoryContent
from src.schemas import StoryContentResponse

router = APIRouter()


@router.get("/", response_model=StoryContentResponse)
async def get_active_story(db: Session = Depends(get_db)):
    """Return the first active story content entry."""
    content = db.query(StoryContent).filter(StoryContent.is_active == True).first()  # noqa: E712
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No story content available"
        )
    return content
