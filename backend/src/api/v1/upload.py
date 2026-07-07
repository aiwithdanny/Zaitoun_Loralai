"""
Image upload endpoint — admin only.
Accepts multipart/form-data file, uploads to Cloudinary, returns the URL.
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status

from src.config.auth import get_current_user
from src.config.cloudinary import upload_image

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    """Upload a product image to Cloudinary.
    Requires admin JWT. Returns the secure Cloudinary URL.
    Accepted formats: JPEG, PNG, WebP. Max size: 5MB."""

    # Validate content type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Allowed: {', '.join(sorted(ALLOWED_TYPES))}",
        )

    # Read file bytes
    file_bytes = await file.read()

    # Validate size
    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large ({len(file_bytes) / 1024 / 1024:.1f}MB). Maximum: 5MB.",
        )

    # Upload to Cloudinary
    try:
        url = upload_image(file_bytes, file.filename or "product.jpg")
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    return {
        "success": True,
        "url": url,
        "message": "Image uploaded successfully",
    }
