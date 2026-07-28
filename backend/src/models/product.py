"""
Product model
"""

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True)
    description = Column(Text)
    short_description = Column(String(500))
    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)
    stock = Column(Integer, default=0)
    category = Column(String(100))
    sort_order = Column(Integer, default=0)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    product_group_id = Column(String(100), index=True, nullable=True)
    size_label = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    order_items = relationship("OrderItem", back_populates="product")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "short_description": self.short_description,
            "price": self.price,
            "discount_price": self.discount_price,
            "stock": self.stock,
            "category": self.category,
            "image_url": self.image_url,
            "is_active": self.is_active,
            "sort_order": self.sort_order,
            "is_featured": self.is_featured,
            "product_group_id": self.product_group_id,
            "size_label": self.size_label,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
