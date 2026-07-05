"""
Customer API endpoints — register, login, profile, order history
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime

from src.models import Customer, Order
from src.models.database import get_db
from src.config.auth import hash_password, verify_password, create_access_token, get_current_customer
from src.schemas import CustomerRegister, CustomerLogin

router = APIRouter()


@router.post("/register")
async def customer_register(request: CustomerRegister, db: Session = Depends(get_db)):
    """Register a new customer account"""
    # Check if email already exists
    existing = db.query(Customer).filter(Customer.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    # Create customer
    customer = Customer(
        name=request.name,
        email=request.email,
        phone=request.phone,
        password_hash=hash_password(request.password),
        is_active=True,
        created_at=datetime.utcnow()
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return {
        "success": True,
        "message": "Account created successfully",
        "customer": customer.to_dict()
    }


@router.post("/login")
async def customer_login(request: CustomerLogin, db: Session = Depends(get_db)):
    """Login and receive a JWT with token_type='customer'"""
    customer = db.query(Customer).filter(Customer.email == request.email).first()

    if not customer or not verify_password(request.password, customer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not customer.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Contact support."
        )

    # Create JWT with explicit token_type='customer'
    access_token = create_access_token(data={
        "sub": customer.email,
        "token_type": "customer",
        "customer_id": customer.id
    })

    # Update last login
    customer.last_login = datetime.utcnow()
    db.commit()

    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "customer": customer.to_dict()
    }


@router.get("/me")
async def get_customer_profile(
    payload: dict = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """Get current customer profile — requires customer token"""
    customer = db.query(Customer).filter(Customer.email == payload.get("sub")).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return {"success": True, "data": customer.to_dict()}


@router.get("/me/orders")
async def get_customer_orders(
    payload: dict = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """Get orders belonging to the authenticated customer — requires customer token"""
    customer = db.query(Customer).filter(Customer.email == payload.get("sub")).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    orders = db.query(Order).filter(
        Order.customer_id == customer.id
    ).order_by(Order.created_at.desc()).all()

    return {
        "success": True,
        "data": [o.to_dict() for o in orders]
    }
