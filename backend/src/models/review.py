"""
Review model
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    product_group_id = Column(String(100), nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5
    review_text = Column(Text, nullable=False)
    photo_url = Column(String(500), nullable=True)
    verified_buyer = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "customer_name": self.customer.name if self.customer else None,
            "product_group_id": self.product_group_id,
            "rating": self.rating,
            "review_text": self.review_text,
            "photo_url": self.photo_url,
            "verified_buyer": self.verified_buyer,
            "is_approved": self.is_approved,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
