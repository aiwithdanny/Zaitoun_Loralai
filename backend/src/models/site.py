"""
Site config model
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from datetime import datetime
from .database import Base


class SiteConfig(Base):
    __tablename__ = "site_config"

    id = Column(Integer, primary_key=True)
    site_name = Column(String(255))
    tagline = Column(String(255))
    logo_url = Column(String(500))
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(String(500))
    facebook_url = Column(String(500))
    instagram_url = Column(String(500))
    x_url = Column(String(500))
    youtube_url = Column(String(500))
    footer_about_text = Column(Text)
    footer_copyright_text = Column(String(500))
    nav_links = Column(JSON)
    footer_legal_links = Column(JSON)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "site_name": self.site_name,
            "tagline": self.tagline,
            "logo_url": self.logo_url,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "facebook_url": self.facebook_url,
            "instagram_url": self.instagram_url,
            "x_url": self.x_url,
            "youtube_url": self.youtube_url,
            "footer_about_text": self.footer_about_text,
            "footer_copyright_text": self.footer_copyright_text,
            "nav_links": self.nav_links,
            "footer_legal_links": self.footer_legal_links,
            "is_active": self.is_active,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
