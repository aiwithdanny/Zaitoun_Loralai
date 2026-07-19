"""
Admin API endpoints with JWT authentication
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session, selectinload
from datetime import datetime, timedelta

from src.models import AdminUser, Product, Order, OrderItem, Customer, Review, Coupon
from src.models.database import get_db
from src.config.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from src.schemas import AdminLogin, AdminRegister

router = APIRouter()


class TokenResponse:
    """Response model for login - includes JWT token"""
    pass


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

    # Create JWT token with explicit token_type='admin'
    access_token = create_access_token(data={"sub": user.username, "token_type": "admin"})

    # Update last login
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
    # Check if any admin user exists (security: only first user can be admin)
    admin_count = db.query(AdminUser).count()
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin registration is restricted. Contact administrator."
        )

    # Check if username/email already exists
    existing_user = db.query(AdminUser).filter(
        (AdminUser.username == request.username) | (AdminUser.email == request.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )

    # Create new admin user with bcrypt hashed password
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


@router.get("/stats")
async def get_admin_stats(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics - requires JWT token"""
    from sqlalchemy import func

    # Verify user exists and is admin
    user = db.query(AdminUser).filter(AdminUser.username == current_user).first()
    if not user or not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access admin stats"
        )

    # Total active products
    total_products = db.query(Product).filter(Product.is_active == True).count()

    # Total revenue (only paid orders)
    total_revenue_result = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == "paid"
    ).first()
    total_revenue = float(total_revenue_result[0] or 0)

    # Revenue this month (only paid orders)
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    month_revenue_result = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == "paid",
        Order.created_at >= month_start
    ).first()
    month_revenue = float(month_revenue_result[0] or 0)

    # Order status breakdown (all orders, regardless of payment status)
    status_breakdown = db.query(
        Order.status,
        func.count(Order.id).label('count')
    ).group_by(Order.status).all()

    status_counts = {status: count for status, count in status_breakdown}

    # Low stock products (stock < 5)
    low_stock = db.query(Product).filter(
        Product.stock < 5,
        Product.is_active == True
    ).order_by(Product.stock.asc()).all()

    low_stock_products = [
        {
            "id": p.id,
            "name": p.name,
            "stock": p.stock,
            "price": p.price
        }
        for p in low_stock
    ]

    # ── Pending orders (from status breakdown) ─────────────────────
    pending_orders = status_counts.get("pending", 0)

    # ── Orders today ──────────────────────────────────────────────
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    orders_today = db.query(func.count(Order.id)).filter(
        Order.created_at >= today_start
    ).scalar() or 0

    # ── New customers this month (registered accounts only) ───────
    new_customers_this_month = db.query(func.count(Customer.id)).filter(
        Customer.created_at >= month_start
    ).scalar() or 0

    # ── Top 5 products by revenue (using subtotal = price × qty) ──
    top_products_raw = (
        db.query(
            OrderItem.product_id,
            Product.name,
            Product.slug,
            func.sum(OrderItem.quantity).label("total_sold"),
            func.sum(OrderItem.subtotal).label("revenue"),
        )
        .join(Product, OrderItem.product_id == Product.id)
        .join(Order, OrderItem.order_id == Order.id)
        .filter(Order.payment_status == "paid", Product.is_active == True)
        .group_by(OrderItem.product_id, Product.name, Product.slug)
        .order_by(func.sum(OrderItem.subtotal).desc())
        .limit(5)
        .all()
    )

    top_products = [
        {
            "id": row.product_id,
            "name": row.name,
            "slug": row.slug,
            "total_sold": int(row.total_sold),
            "revenue": float(row.revenue),
        }
        for row in top_products_raw
    ]

    return {
        "success": True,
        "data": {
            "total_products": total_products,
            "total_revenue": total_revenue,
            "revenue_this_month": month_revenue,
            "order_status_breakdown": status_counts,
            "low_stock_products": low_stock_products,
            "pending_orders": pending_orders,
            "orders_today": orders_today,
            "new_customers_this_month": new_customers_this_month,
            "top_products": top_products
        }
    }


@router.get("/profile")
async def get_admin_profile(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
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


# ─── REVIEW MODERATION ─────────────────────────────────────────────


@router.get("/reviews")
async def list_reviews(
    status: str = "pending",
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all reviews with optional status filter: pending / approved / rejected. Admin only."""
    query = db.query(Review).options(selectinload(Review.customer))

    if status == "pending":
        query = query.filter(Review.is_approved == False, Review.review_text != "__rejected__")
    elif status == "approved":
        query = query.filter(Review.is_approved == True)
    elif status == "rejected":
        query = query.filter(Review.review_text == "__rejected__")
    # "all" — no filter

    reviews = query.order_by(Review.created_at.desc()).all()
    return {"success": True, "data": [r.to_dict() for r in reviews], "count": len(reviews)}


@router.put("/reviews/{review_id}/approve")
async def approve_review(
    review_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Approve a review (sets is_approved=True). Admin only."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_approved = True
    review.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(review)

    return {"success": True, "data": review.to_dict(), "message": "Review approved."}


@router.put("/reviews/{review_id}/reject")
async def reject_review(
    review_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Reject a review (clears review_text, sets is_approved=False). Admin only."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_approved = False
    review.review_text = "__rejected__"
    review.verified_buyer = False
    review.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(review)

    return {"success": True, "data": review.to_dict(), "message": "Review rejected."}


@router.delete("/reviews/{review_id}")
async def delete_review(
    review_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Permanently delete a review from the database. Admin only."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()

    return {"success": True, "message": "Review permanently deleted."}


# ─── COUPON MANAGEMENT ────────────────────────────────────────────────


@router.get("/coupons")
async def get_coupons(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all coupons. Admin only."""
    coupons = db.query(Coupon).order_by(Coupon.created_at.desc()).all()
    return {"success": True, "data": [c.to_dict() for c in coupons]}


@router.post("/coupons")
async def create_coupon(
    data: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new coupon. Admin only."""
    code = data.get("code", "").upper().strip()
    existing = db.query(Coupon).filter(Coupon.code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail="A coupon with this code already exists")

    coupon = Coupon(
        code=code,
        discount_type=data.get("discount_type", "percentage"),
        discount_value=data.get("discount_value", 0),
        min_order_amount=data.get("min_order_amount"),
        max_discount_amount=data.get("max_discount_amount"),
        expiry_date=data.get("expiry_date"),
        usage_limit=data.get("usage_limit"),
        times_used=0,
        is_active=data.get("is_active", True),
        created_at=datetime.utcnow(),
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)

    return {"success": True, "data": coupon.to_dict(), "message": "Coupon created successfully"}


@router.put("/coupons/{coupon_id}")
async def update_coupon(
    coupon_id: int,
    data: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a coupon. Admin only."""
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    updateable_fields = [
        "discount_type", "discount_value", "min_order_amount",
        "max_discount_amount", "expiry_date", "usage_limit", "is_active",
    ]
    for field in updateable_fields:
        if field in data:
            setattr(coupon, field, data[field])

    # Allow code update but keep it uppercase
    if "code" in data:
        coupon.code = data["code"].upper().strip()

    db.commit()
    db.refresh(coupon)

    return {"success": True, "data": coupon.to_dict(), "message": "Coupon updated successfully"}


@router.delete("/coupons/{coupon_id}")
async def delete_coupon(
    coupon_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a coupon. Admin only."""
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    db.delete(coupon)
    db.commit()

    return {"success": True, "message": "Coupon deleted successfully"}
