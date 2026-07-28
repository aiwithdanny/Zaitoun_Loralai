"""
Coupon model
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime
from .database import Base


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    discount_type = Column(String(20), nullable=False)  # "percentage" or "fixed"
    discount_value = Column(Float, nullable=False)
    min_order_amount = Column(Float, nullable=True)
    max_discount_amount = Column(Float, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    usage_limit = Column(Integer, nullable=True)
    times_used = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "discount_type": self.discount_type,
            "discount_value": self.discount_value,
            "min_order_amount": self.min_order_amount,
            "max_discount_amount": self.max_discount_amount,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
            "usage_limit": self.usage_limit,
            "times_used": self.times_used,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
