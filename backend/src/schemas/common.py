"""
Generic response schemas
"""

from pydantic import BaseModel
from typing import Optional


class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool = True
    message: str = "Operation completed successfully"


class ErrorResponse(BaseModel):
    """Generic error response"""
    success: bool = False
    detail: str
    error_code: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "detail": "Product not found",
                "error_code": "PRODUCT_NOT_FOUND"
            }
        }
