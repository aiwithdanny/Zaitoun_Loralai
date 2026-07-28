"""
Order models
"""

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    customer_address = Column(Text)
    total_amount = Column(Float, nullable=False)
    coupon_code = Column(String(50), nullable=True)
    discount_amount = Column(Float, default=0)
    status = Column(String(50), default="pending")
    payment_method = Column(String(50), default="whatsapp")
    payment_status = Column(String(50), default="unpaid")
    whatsapp_message_id = Column(String(255))
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = relationship("OrderItem", back_populates="order")
    customer = relationship("Customer", back_populates="orders")

    def to_dict(self):
        return {
            "id": self.id,
            "order_number": self.order_number,
            "customer_name": self.customer_name,
            "customer_email": self.customer_email,
            "customer_phone": self.customer_phone,
            "customer_address": self.customer_address,
            "total_amount": self.total_amount,
            "coupon_code": self.coupon_code,
            "discount_amount": self.discount_amount,
            "status": self.status,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "whatsapp_message_id": self.whatsapp_message_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    product_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    subtotal = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "product_name": self.product_name,
            "product_price": self.product_price,
            "quantity": self.quantity,
            "subtotal": self.subtotal,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
