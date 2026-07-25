"""
Site Config API endpoint

Public: GET /api/v1/site-config/ → returns active site config
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import SiteConfig

router = APIRouter()


@router.get("/")
async def get_site_config(db: Session = Depends(get_db)):
    """Return the active site config."""
    config = (
        db.query(SiteConfig)
        .filter(SiteConfig.is_active == True)  # noqa: E712
        .first()
    )
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No site config available"
        )
    return config
