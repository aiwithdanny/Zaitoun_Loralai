"""
Admin authentication endpoints: login, register, profile
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime

from src.models import AdminUser
from src.models.database import get_db
from src.config.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from src.schemas import AdminLogin, AdminRegister

router = APIRouter()


@router.post("/login")
async def admin_login(request: AdminLogin, db: Session = Depends(get_db)):
    """Admin login endpoint - returns JWT token"""
    user = db.query(AdminUser).filter(AdminUser.username == request.username).first()

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    access_token = create_access_token(data={"sub": user.username, "token_type": "admin"})

    user.last_login = datetime.utcnow()
    db.commit()

    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    }


@router.post("/register")
async def admin_register(request: AdminRegister, db: Session = Depends(get_db)):
    """Admin registration endpoint - only first user should register"""
    admin_count = db.query(AdminUser).count()
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin registration is restricted. Contact administrator."
        )

    existing_user = db.query(AdminUser).filter(
        (AdminUser.username == request.username) | (AdminUser.email == request.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )

    new_user = AdminUser(
        username=request.username,
        email=request.email,
        password_hash=hash_password(request.password),
        is_active=True,
        is_admin=True,
        created_at=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "Admin user created successfully",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "is_admin": new_user.is_admin
        }
    }


@router.get("/profile")
async def get_admin_profile(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current admin user profile - requires JWT token"""
    user = db.query(AdminUser).filter(AdminUser.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_login": user.last_login.isoformat() if user.last_login else None
        }
    }
