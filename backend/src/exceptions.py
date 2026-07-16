"""
Custom exception handlers for consistent error responses
"""

from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger(__name__)


class ZaitounException(HTTPException):
    """Base exception for Zaitoun API"""
    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        detail: str = "An error occurred",
        error_code: str = "UNKNOWN_ERROR"
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.detail_message = detail


class ProductNotFound(ZaitounException):
    """Product not found exception"""
    def __init__(self, product_id: str = None):
        detail = f"Product {product_id} not found" if product_id else "Product not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="PRODUCT_NOT_FOUND"
        )


class OrderNotFound(ZaitounException):
    """Order not found exception"""
    def __init__(self, order_number: str = None):
        detail = f"Order {order_number} not found" if order_number else "Order not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="ORDER_NOT_FOUND"
        )


class InsufficientStock(ZaitounException):
    """Insufficient stock exception"""
    def __init__(self, product_name: str, available: int, requested: int):
        detail = f"Insufficient stock for {product_name}. Available: {available}, Requested: {requested}"
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code="INSUFFICIENT_STOCK"
        )


class InvalidCredentials(ZaitounException):
    """Invalid credentials exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            error_code="INVALID_CREDENTIALS"
        )


class UnauthorizedAccess(ZaitounException):
    """Unauthorized access exception"""
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=message,
            error_code="UNAUTHORIZED"
        )


class ForbiddenAccess(ZaitounException):
    """Forbidden access exception"""
    def __init__(self, message: str = "Access forbidden"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message,
            error_code="FORBIDDEN"
        )


class InvalidWebhookSignature(ZaitounException):
    """Invalid webhook signature exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid webhook signature",
            error_code="INVALID_SIGNATURE"
        )


class DuplicateEntry(ZaitounException):
    """Duplicate entry exception"""
    def __init__(self, message: str = "Entry already exists"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
            error_code="DUPLICATE_ENTRY"
        )


class ValidationError(ZaitounException):
    """Validation error exception"""
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=message,
            error_code="VALIDATION_ERROR"
        )


class ExternalServiceError(ZaitounException):
    """External service error exception"""
    def __init__(self, service: str, message: str = None):
        detail = f"Error connecting to {service}" + (f": {message}" if message else "")
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail,
            error_code="EXTERNAL_SERVICE_ERROR"
        )


# Exception handlers
def _cors_response(request, resp: JSONResponse) -> JSONResponse:
    """Add CORS headers to an error response."""
    origin = request.headers.get("origin", "")
    resp.headers["Access-Control-Allow-Origin"] = origin if origin else "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    resp.headers["Access-Control-Allow-Headers"] = "*"
    return resp


async def zaitoun_exception_handler(request: Request, exc: ZaitounException):
    """Handle Zaitoun custom exceptions"""
    logger.error(f"ZaitounException: {exc.error_code} - {exc.detail_message}")
    return _cors_response(request, JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code,
            "detail": exc.detail,
            "timestamp": __import__('datetime').datetime.utcnow().isoformat()
        }
    ))


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"][1:]),
            "message": error["msg"],
            "type": error["type"]
        })

    logger.warning(f"Validation error: {errors}")
    return _cors_response(request, JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error_code": "VALIDATION_ERROR",
            "detail": "Request validation failed",
            "errors": errors,
            "timestamp": __import__('datetime').datetime.utcnow().isoformat()
        }
    ))


async def generic_exception_handler(request: Request, exc: Exception):
    """Handle generic exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return _cors_response(request, JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_code": "INTERNAL_ERROR",
            "detail": "An internal error occurred. Please try again later.",
            "timestamp": __import__('datetime').datetime.utcnow().isoformat()
        }
    ))
