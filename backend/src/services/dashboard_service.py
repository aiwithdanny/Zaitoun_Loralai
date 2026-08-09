"""
Admin dashboard service — aggregate stats queries.

Extracted from src/api/v1/admin/dashboard.py::get_admin_stats so the
route handler stays thin. Response shape is unchanged.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from src.models import Product, Order, OrderItem, Customer


def build_admin_stats(db: Session) -> dict:
    """Compute all admin dashboard statistics (single aggregate query set)."""

    total_products = db.query(Product).filter(Product.is_active == True).count()

    total_revenue_result = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == "paid"
    ).first()
    total_revenue = float(total_revenue_result[0] or 0)

    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    month_revenue_result = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == "paid",
        Order.created_at >= month_start
    ).first()
    month_revenue = float(month_revenue_result[0] or 0)

    status_breakdown = db.query(
        Order.status,
        func.count(Order.id).label('count')
    ).group_by(Order.status).all()
    status_counts = {status: count for status, count in status_breakdown}

    low_stock = db.query(Product).filter(
        Product.stock < 5,
        Product.is_active == True
    ).order_by(Product.stock.asc()).all()
    low_stock_products = [
        {"id": p.id, "name": p.name, "stock": p.stock, "price": p.price}
        for p in low_stock
    ]

    pending_orders = status_counts.get("pending", 0)

    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    orders_today = db.query(func.count(Order.id)).filter(
        Order.created_at >= today_start
    ).scalar() or 0

    new_customers_this_month = db.query(func.count(Customer.id)).filter(
        Customer.created_at >= month_start
    ).scalar() or 0

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
        {"id": row.product_id, "name": row.name, "slug": row.slug,
         "total_sold": int(row.total_sold), "revenue": float(row.revenue)}
        for row in top_products_raw
    ]

    return {
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
