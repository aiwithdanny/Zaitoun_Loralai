"""
Admin image upload endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from src.config.auth import get_current_user

router = APIRouter()


def _validate_and_upload(file: UploadFile, folder: str) -> str:
    """Common file validation and Cloudinary upload logic."""
    from src.config.cloudinary import upload_image
    import secrets

    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
        )

    contents = file.file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 5MB"
        )

    url = upload_image(contents, f"{folder}/{secrets.token_hex(8)}")
    if not url:
        raise HTTPException(
            status_code=500,
            detail="Failed to upload image to Cloudinary"
        )
    return url


@router.post("/homepage/upload-image")
async def upload_homepage_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    """Upload a homepage hero image. Admin only."""
    url = _validate_and_upload(file, "homepage")
    return {"success": True, "url": url, "message": "Image uploaded successfully"}


@router.post("/recipes/upload-image")
async def upload_recipe_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    """Upload a recipe image. Admin only."""
    url = _validate_and_upload(file, "recipes")
    return {"success": True, "url": url, "message": "Image uploaded successfully"}


@router.post("/testimonials/upload-image")
async def upload_testimonial_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    """Upload a testimonial image. Admin only."""
    url = _validate_and_upload(file, "testimonials")
    return {"success": True, "url": url, "message": "Image uploaded successfully"}


@router.post("/story/upload-image")
async def upload_story_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    """Upload a story image. Admin only."""
    url = _validate_and_upload(file, "story")
    return {"success": True, "url": url, "message": "Image uploaded successfully"}
