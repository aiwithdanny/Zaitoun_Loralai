"""
Order API endpoints with JWT protection for admin operations
"""

import secrets
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.models import Order, OrderItem, Product
from src.config.auth import get_current_user, get_optional_customer
from src.schemas import OrderCreate, OrderStatusUpdate, OrderPaymentUpdate

router = APIRouter()


def generate_order_number():
    """Generate unique order number"""
    return f"ZL-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{secrets.token_hex(4).upper()}"


@router.get("/")
async def get_orders(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by order status"),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders with pagination and optional status filter - Admin only (requires JWT token)"""
    query = db.query(Order)

    # Filter by status if provided
    if status:
        valid_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Valid statuses: {', '.join(valid_statuses)}"
            )
        query = query.filter(Order.status == status)

    # Count total before pagination
    total_count = query.count()

    # Apply sorting and pagination
    orders = query.order_by(Order.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "success": True,
        "data": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "customer_name": o.customer_name,
                "total_amount": o.total_amount,
                "status": o.status,
                "payment_status": o.payment_status,
                "created_at": o.created_at.isoformat() if o.created_at else None
            }
            for o in orders
        ],
        "count": total_count
    }


@router.post("/")
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    customer_payload: Optional[dict] = Depends(get_optional_customer)
):
    """Create a new order - Public endpoint (supports guest + logged-in customers)"""
    # Calculate total
    total_amount = 0.0
    order_items = []

    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with ID {item.product_id} not found"
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}"
            )

        subtotal = product.price * item.quantity
        total_amount += subtotal

        order_items.append({
            "product_id": product.id,
            "product_name": product.name,
            "product_price": product.price,
            "quantity": item.quantity,
            "subtotal": subtotal
        })

        # Update stock
        product.stock -= item.quantity

    # Extract customer_id from optional JWT (None for guest orders)
    customer_id = customer_payload.get("customer_id") if customer_payload else None

    # Create order
    order = Order(
        order_number=generate_order_number(),
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        customer_address=order_data.customer_address,
        total_amount=total_amount,
        payment_method=order_data.payment_method,
        status="pending",
        payment_status="unpaid",
        customer_id=customer_id,
        created_at=datetime.utcnow()
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    # Create order items
    for item_data in order_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data["product_id"],
            product_name=item_data["product_name"],
            product_price=item_data["product_price"],
            quantity=item_data["quantity"],
            subtotal=item_data["subtotal"]
        )
        db.add(order_item)

    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "data": order.to_dict(),
        "message": "Order created successfully. Please complete payment via WhatsApp."
    }


@router.get("/{order_number}")
async def get_order(order_number: str, db: Session = Depends(get_db)):
    """Get order by order number - Public endpoint"""
    order = db.query(Order).filter(Order.order_number == order_number).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {"success": True, "data": order.to_dict()}


@router.put("/{order_number}/status")
async def update_order_status(
    order_number: str,
    status_update: OrderStatusUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update order status - Admin only (requires JWT token)"""
    order = db.query(Order).filter(Order.order_number == order_number).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # OrderStatusUpdate schema already validates the status via Pydantic validator
    order.status = status_update.status
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)

    return {"success": True, "data": order.to_dict(), "message": "Order status updated"}


@router.put("/{order_number}/payment")
async def update_payment_status(
    order_number: str,
    payment_update: OrderPaymentUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update payment status - Admin only (requires JWT token)"""
    order = db.query(Order).filter(Order.order_number == order_number).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # OrderPaymentUpdate schema already validates the payment_status via Pydantic validator
    order.payment_status = payment_update.payment_status
    order.whatsapp_message_id = payment_update.whatsapp_message_id
    order.updated_at = datetime.utcnow()

    if payment_update.payment_status == "paid" and order.status == "pending":
        order.status = "confirmed"

    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "data": order.to_dict(),
        "message": f"Payment status updated to {payment_update.payment_status}"
    }
