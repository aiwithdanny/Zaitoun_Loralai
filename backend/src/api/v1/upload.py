"""
Image upload endpoint — admin only.
Accepts multipart/form-data file, uploads to Cloudinary, returns the URL.
"""

from fastapi import APIRouter, UploadFile, File, Depends

from src.config.auth import get_current_user
from src.services.image_service import (
    MAX_SIZE,
    validate_image_type,
    validate_image_size,
    upload_image_bytes,
)

router = APIRouter()


@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    """Upload a product image to Cloudinary.
    Requires admin JWT. Returns the secure Cloudinary URL.
    Accepted formats: JPEG, PNG, WebP. Max size: 5MB."""

    # Validate content type
    validate_image_type(file.content_type)

    # Read file bytes
    file_bytes = await file.read()

    # Validate size
    validate_image_size(file_bytes)

    # Upload to Cloudinary
    url = upload_image_bytes(file_bytes, file.filename or "product.jpg")

    return {
        "success": True,
        "url": url,
        "message": "Image uploaded successfully",
    }
