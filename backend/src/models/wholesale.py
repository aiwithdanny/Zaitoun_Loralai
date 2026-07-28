"""
Wholesale models
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime
from .database import Base


class WholesaleConfig(Base):
    __tablename__ = "wholesale_config"

    id = Column(Integer, primary_key=True)
    heading = Column(String(255))
    description = Column(Text)
    cta_heading = Column(String(255))
    cta_description = Column(Text)
    whatsapp_number = Column(String(50))
    whatsapp_message = Column(String(500))
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "heading": self.heading,
            "description": self.description,
            "cta_heading": self.cta_heading,
            "cta_description": self.cta_description,
            "whatsapp_number": self.whatsapp_number,
            "whatsapp_message": self.whatsapp_message,
            "is_active": self.is_active,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class WholesaleSize(Base):
    __tablename__ = "wholesale_sizes"

    id = Column(Integer, primary_key=True)
    size_liters = Column(Integer, nullable=False)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "size_liters": self.size_liters,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
