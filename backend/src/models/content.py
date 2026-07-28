"""
Content models (Founder, HomepageContent, StoryContent, RecipeContent, Recipe, Testimonial, QualityFeature, TastingNote)
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime
from .database import Base


class NewsletterSubscription(Base):
    __tablename__ = "newsletter_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    unsubscribed_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "subscribed_at": self.subscribed_at.isoformat() if self.subscribed_at else None,
            "unsubscribed_at": self.unsubscribed_at.isoformat() if self.unsubscribed_at else None,
            "is_active": self.is_active
        }


class Founder(Base):
    __tablename__ = "founders"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(500))
    name = Column(String(255), nullable=False)
    designation = Column(String(255))
    heading = Column(String(255))
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "name": self.name,
            "designation": self.designation,
            "heading": self.heading,
            "description": self.description,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class HomepageContent(Base):
    __tablename__ = "homepage_content"

    id = Column(Integer, primary_key=True)
    hero_image_url = Column(String(500))
    hero_brand_name = Column(String(255))
    hero_headline = Column(String(255))
    hero_description = Column(Text)
    hero_primary_cta_text = Column(String(255))
    hero_secondary_cta_text = Column(String(255))
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "hero_image_url": self.hero_image_url,
            "hero_brand_name": self.hero_brand_name,
            "hero_headline": self.hero_headline,
            "hero_description": self.hero_description,
            "hero_primary_cta_text": self.hero_primary_cta_text,
            "hero_secondary_cta_text": self.hero_secondary_cta_text,
            "is_active": self.is_active,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class StoryContent(Base):
    __tablename__ = "story_content"

    id = Column(Integer, primary_key=True)
    section_tag = Column(String(255))
    headline = Column(String(255))
    body = Column(Text)
    pull_quote = Column(Text)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "section_tag": self.section_tag,
            "headline": self.headline,
            "body": self.body,
            "pull_quote": self.pull_quote,
            "image_url": self.image_url,
            "is_active": self.is_active,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class RecipeContent(Base):
    __tablename__ = "recipe_content"

    id = Column(Integer, primary_key=True)
    section_tag = Column(String(255))
    headline = Column(String(255))
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "section_tag": self.section_tag,
            "headline": self.headline,
            "is_active": self.is_active,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "image_url": self.image_url,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255))
    quote = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    image_url = Column(String(500))
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "quote": self.quote,
            "rating": self.rating,
            "image_url": self.image_url,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class QualityFeature(Base):
    __tablename__ = "quality_features"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon_name = Column(String(100), nullable=False, default="leaf")
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "icon_name": self.icon_name,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class TastingNote(Base):
    __tablename__ = "tasting_notes"

    id = Column(Integer, primary_key=True)
    label = Column(String(100), nullable=False)
    value = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "label": self.label,
            "value": self.value,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
