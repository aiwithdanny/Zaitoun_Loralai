"""
Content management schemas (Founder, Homepage, Story, Recipes, Testimonials, Quality Features, Tasting Notes)
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ==================== FOUNDER SCHEMAS ====================

class FounderCreate(BaseModel):
    """Schema for creating a founder entry"""
    image_url: Optional[str] = Field(None, max_length=500, description="Cloudinary image URL")
    name: str = Field(..., min_length=1, max_length=255, description="Founder name")
    designation: Optional[str] = Field(None, max_length=255, description="Designation/title")
    heading: Optional[str] = Field(None, max_length=255, description="Section heading")
    description: Optional[str] = Field(None, description="Full bio/description")
    is_active: bool = Field(default=True, description="Whether this entry is active")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Abdul Naqeeb",
                "designation": "FOUNDER & CEO",
                "heading": "Meet Our Founder",
                "description": "Abdul Naqeeb leads Zaitoun Loralai...",
                "is_active": True
            }
        }


class FounderUpdate(BaseModel):
    """Schema for updating a founder entry (all fields optional)"""
    image_url: Optional[str] = Field(None, max_length=500)
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    designation: Optional[str] = Field(None, max_length=255)
    heading: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class FounderResponse(BaseModel):
    """Schema for founder response"""
    id: int
    image_url: Optional[str]
    name: str
    designation: Optional[str]
    heading: Optional[str]
    description: Optional[str]
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== HOMEPAGE CONTENT SCHEMAS ====================

class HomepageContentUpdate(BaseModel):
    """Schema for updating homepage content (all fields optional)"""
    hero_image_url: Optional[str] = Field(None, max_length=500)
    hero_brand_name: Optional[str] = Field(None, max_length=255)
    hero_headline: Optional[str] = Field(None, max_length=255)
    hero_description: Optional[str] = None
    hero_primary_cta_text: Optional[str] = Field(None, max_length=255)
    hero_secondary_cta_text: Optional[str] = Field(None, max_length=255)
    product_section_tag: Optional[str] = Field(None, max_length=255)
    product_section_heading: Optional[str] = Field(None, max_length=255)
    product_section_description: Optional[str] = None
    is_active: Optional[bool] = None


class HomepageContentResponse(BaseModel):
    """Schema for homepage content response"""
    id: int
    hero_image_url: Optional[str]
    hero_brand_name: Optional[str]
    hero_headline: Optional[str]
    hero_description: Optional[str]
    hero_primary_cta_text: Optional[str]
    hero_secondary_cta_text: Optional[str]
    product_section_tag: Optional[str]
    product_section_heading: Optional[str]
    product_section_description: Optional[str]
    is_active: bool
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== STORY CONTENT SCHEMAS ====================

class StoryContentUpdate(BaseModel):
    """Schema for updating story content (all fields optional)"""
    section_tag: Optional[str] = Field(None, max_length=255)
    headline: Optional[str] = Field(None, max_length=255)
    body: Optional[str] = None
    pull_quote: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None


class StoryContentResponse(BaseModel):
    """Schema for story content response"""
    id: int
    section_tag: Optional[str]
    headline: Optional[str]
    body: Optional[str]
    pull_quote: Optional[str]
    image_url: Optional[str]
    is_active: bool
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== RECIPE CONTENT SCHEMAS ====================

class RecipeContentUpdate(BaseModel):
    """Schema for updating recipe section content (all fields optional)"""
    section_tag: Optional[str] = Field(None, max_length=255)
    headline: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None


class RecipeContentResponse(BaseModel):
    """Schema for recipe section content response"""
    id: int
    section_tag: Optional[str]
    headline: Optional[str]
    is_active: bool
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== RECIPE SCHEMAS ====================

class RecipeCreate(BaseModel):
    """Schema for creating a recipe entry"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)
    sort_order: Optional[int] = Field(default=0)
    is_active: bool = Field(default=True)


class RecipeUpdate(BaseModel):
    """Schema for updating a recipe entry (all fields optional)"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class RecipeResponse(BaseModel):
    """Schema for recipe response"""
    id: int
    title: str
    description: Optional[str]
    image_url: Optional[str]
    sort_order: int
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== TESTIMONIAL SCHEMAS ====================

class TestimonialCreate(BaseModel):
    """Schema for creating a testimonial"""
    name: str = Field(..., min_length=1, max_length=255, description="Customer name")
    location: Optional[str] = Field(None, max_length=255, description="Customer location")
    quote: str = Field(..., min_length=1, description="Testimonial quote")
    rating: int = Field(default=5, ge=1, le=5, description="Rating 1-5")
    image_url: Optional[str] = Field(None, max_length=500, description="Optional customer photo URL")
    sort_order: int = Field(default=0, description="Display order (lower = first)")
    is_active: bool = Field(default=True, description="Whether this testimonial is active")


class TestimonialUpdate(BaseModel):
    """Schema for updating a testimonial (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    quote: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    image_url: Optional[str] = Field(None, max_length=500)
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class TestimonialResponse(BaseModel):
    """Schema for testimonial response"""
    id: int
    name: str
    location: Optional[str]
    quote: str
    rating: int
    image_url: Optional[str]
    sort_order: int
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== QUALITY FEATURE SCHEMAS ====================

class QualityFeatureCreate(BaseModel):
    """Schema for creating a quality feature"""
    title: str = Field(..., min_length=1, max_length=255, description="Feature title")
    description: str = Field(..., min_length=1, description="Feature description")
    icon_name: str = Field(default="leaf", max_length=100, description="Lucide icon name")
    sort_order: int = Field(default=0, description="Display order (lower = first)")
    is_active: bool = Field(default=True, description="Whether this feature is active")


class QualityFeatureUpdate(BaseModel):
    """Schema for updating a quality feature (all fields optional)"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    icon_name: Optional[str] = Field(None, max_length=100)
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class QualityFeatureResponse(BaseModel):
    """Schema for quality feature response"""
    id: int
    title: str
    description: str
    icon_name: str
    sort_order: int
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== TASTING NOTE SCHEMAS ====================

class TastingNoteCreate(BaseModel):
    """Schema for creating a tasting note"""
    label: str = Field(..., min_length=1, max_length=100, description="Note label (e.g. Profile, Aroma)")
    value: str = Field(..., min_length=1, description="Note value text")
    sort_order: int = Field(default=0, description="Display order (lower = first)")
    is_active: bool = Field(default=True, description="Whether this note is active")


class TastingNoteUpdate(BaseModel):
    """Schema for updating a tasting note (all fields optional)"""
    label: Optional[str] = Field(None, min_length=1, max_length=100)
    value: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class TastingNoteResponse(BaseModel):
    """Schema for tasting note response"""
    id: int
    label: str
    value: str
    sort_order: int
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== PRODUCT ACCORDION SCHEMAS ====================

class ProductAccordionCreate(BaseModel):
    """Schema for creating a product accordion section"""
    title: str = Field(..., min_length=1, max_length=255, description="Accordion title")
    content: str = Field(..., min_length=1, description="Accordion content (HTML supported)")
    sort_order: int = Field(default=0, description="Display order (lower = first)")
    is_active: bool = Field(default=True, description="Whether this section is active")


class ProductAccordionUpdate(BaseModel):
    """Schema for updating a product accordion section (all fields optional)"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class ProductAccordionResponse(BaseModel):
    """Schema for product accordion response"""
    id: int
    title: str
    content: str
    sort_order: int
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
