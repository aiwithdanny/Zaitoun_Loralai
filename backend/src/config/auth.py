"""
JWT Authentication configuration
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme
security = HTTPBearer()


def _prepare_password(password: str) -> str:
    """Truncate passwords to bcrypt's 72-byte limit before hashing or verification."""
    if password is None:
        password = ""
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > 72:
        password = password_bytes[:72].decode("utf-8", errors="ignore")
    return password


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(_prepare_password(password))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(_prepare_password(plain_password), hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Default token_type to "admin" for backward compatibility
    to_encode.setdefault("token_type", "admin")
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify JWT token and return the full payload dict"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") is None:
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Dependency: verify JWT token and require token_type == 'admin'.
    Customer tokens are explicitly rejected at this layer."""
    token = credentials.credentials
    payload = verify_token(token)
    if payload.get("token_type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload.get("sub")


async def get_current_customer(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency: verify JWT token and require token_type == 'customer'.
    Admin tokens are explicitly rejected at this layer.
    Returns the full payload dict (includes sub=email, customer_id, token_type)."""
    token = credentials.credentials
    payload = verify_token(token)
    if payload.get("token_type") != "customer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


async def get_optional_customer(request: Request) -> Optional[dict]:
    """Dependency: read a customer JWT if present, but NEVER reject the request.

    - No Authorization header → returns None (guest checkout continues)
    - Invalid / expired token   → returns None (silently ignored)
    - Valid admin token         → returns None (don't link orders to admin users)
    - Valid customer token      → returns payload dict (includes customer_id)
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    try:
        token = auth_header.split(" ", 1)[1]
        payload = verify_token(token)
        if payload.get("token_type") == "customer":
            return payload
    except Exception:
        pass
    return None
