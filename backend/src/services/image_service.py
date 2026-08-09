"""
Image upload service — single source of truth for upload validation.

Consolidates the ALLOWED_TYPES / MAX_SIZE constants and Cloudinary
upload call previously duplicated across:
  - src/api/v1/upload.py        (admin product image)
  - src/api/v1/admin/uploads.py (admin section images)
  - src/api/v1/reviews.py       (customer review photo)

Validation order and error messages are preserved per caller:
  - validate_image_type / validate_image_size  -> detailed messages
    (used by upload.py and reviews.py)
  - admin/uploads.py keeps its brief messages but shares the constants
  - upload_image_bytes maps RuntimeError -> HTTP 502 (upload.py/reviews.py)
"""

from fastapi import HTTPException
from src.config.cloudinary import upload_image

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB


def validate_image_type(content_type: str) -> None:
    """Raise HTTPException(400) if the content type is not allowed.

    Message matches the original upload.py / reviews.py wording.
    """
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid file type '{content_type}'. "
                f"Allowed: {', '.join(sorted(ALLOWED_TYPES))}"
            ),
        )


def validate_image_size(file_bytes: bytes) -> None:
    """Raise HTTPException(400) if the file exceeds MAX_SIZE.

    Message matches the original upload.py / reviews.py wording.
    """
    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(
            status_code=400,
            detail=(
                f"File too large ({len(file_bytes) / 1024 / 1024:.1f}MB). "
                "Maximum: 5MB."
            ),
        )


def upload_image_bytes(file_bytes: bytes, public_id: str) -> str:
    """Upload bytes to Cloudinary; map RuntimeError to HTTP 502.

    Matches the original upload.py / reviews.py behavior.
    """
    try:
        url = upload_image(file_bytes, public_id)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    return url
