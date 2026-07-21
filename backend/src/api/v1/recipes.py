"""
Recipes API endpoints

Public: GET /api/v1/recipes/ → returns section content + recipe list
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import RecipeContent, Recipe

router = APIRouter()


@router.get("/")
async def get_recipes(db: Session = Depends(get_db)):
    """Return active recipe content and all active recipes ordered by sort_order."""
    content = db.query(RecipeContent).filter(RecipeContent.is_active == True).first()  # noqa: E712
    recipes = db.query(Recipe).filter(Recipe.is_active == True).order_by(Recipe.sort_order).all()  # noqa: E712

    return {
        "content": content.to_dict() if content else None,
        "recipes": [r.to_dict() for r in recipes]
    }
