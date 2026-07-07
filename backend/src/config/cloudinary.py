"""
Cloudinary configuration for product image uploads.
"""

import os
from typing import Optional
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()


def configure_cloudinary():
    """Initialize Cloudinary SDK with credentials from environment."""
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True,
    )


def upload_image(file_bytes: bytes, filename: str) -> Optional[str]:
    """
    Upload an image file to Cloudinary.
    Returns the secure URL of the uploaded image, or None on failure.
    """
    configure_cloudinary()

    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            public_id=f"products/{os.path.splitext(filename)[0]}_{os.urandom(4).hex()}",
            overwrite=False,
            resource_type="image",
            allowed_formats=["jpg", "jpeg", "png", "webp"],
            max_file_size=5 * 1024 * 1024,  # 5MB
        )
        return result.get("secure_url")
    except Exception as e:
        raise RuntimeError(f"Cloudinary upload failed: {str(e)}")
