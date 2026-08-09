"""
Admin dashboard endpoints: stats
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from src.models import AdminUser
from src.models.database import get_db
from src.config.auth import get_current_user
from src.services.dashboard_service import build_admin_stats

router = APIRouter()


@router.get("/stats")
async def get_admin_stats(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get admin dashboard statistics - requires JWT token"""
    user = db.query(AdminUser).filter(AdminUser.username == current_user).first()
    if not user or not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access admin stats"
        )

    return {
        "success": True,
        "data": build_admin_stats(db)
    }
