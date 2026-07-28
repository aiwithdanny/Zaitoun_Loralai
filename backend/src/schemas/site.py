"""
Site config schemas
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class NavLinkItem(BaseModel):
    """Schema for a single navigation link"""
    label: str
    href: str


class SiteConfigUpdate(BaseModel):
    """Schema for updating site config (all fields optional)"""
    site_name: Optional[str] = None
    tagline: Optional[str] = None
    logo_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    x_url: Optional[str] = None
    youtube_url: Optional[str] = None
    footer_about_text: Optional[str] = None
    footer_copyright_text: Optional[str] = None
    nav_links: Optional[List[NavLinkItem]] = None
    is_active: Optional[bool] = None


class SiteConfigResponse(BaseModel):
    """Schema for site config response"""
    id: int
    site_name: Optional[str]
    tagline: Optional[str]
    logo_url: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    facebook_url: Optional[str]
    instagram_url: Optional[str]
    x_url: Optional[str]
    youtube_url: Optional[str]
    footer_about_text: Optional[str]
    footer_copyright_text: Optional[str]
    nav_links: Optional[List[NavLinkItem]]
    is_active: bool
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
