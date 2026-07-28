"""
Wishlist model
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from .database import Base


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    product_group_id = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "product_group_id": self.product_group_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
