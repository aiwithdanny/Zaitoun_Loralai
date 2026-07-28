"""
Admin CMS endpoints (content management for all site sections)
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from src.models import (
    Founder, HomepageContent, StoryContent, RecipeContent, Recipe,
    Testimonial, QualityFeature, TastingNote,
    ProductAccordion,
    WholesaleConfig, WholesaleSize, SiteConfig,
)
from src.models.database import get_db
from src.config.auth import get_current_user
from src.schemas import (
    FounderCreate, FounderUpdate,
    HomepageContentUpdate,
    StoryContentUpdate,
    RecipeContentUpdate, RecipeCreate, RecipeUpdate,
    TestimonialCreate, TestimonialUpdate,
    QualityFeatureCreate, QualityFeatureUpdate,
    TastingNoteCreate, TastingNoteUpdate,
    ProductAccordionCreate, ProductAccordionUpdate,
    WholesaleConfigUpdate, WholesaleSizeCreate, WholesaleSizeUpdate,
    SiteConfigUpdate,
)

router = APIRouter()


# ─── FOUNDER ─────────────────────────────────────────────────────────

@router.get("/founder")
async def get_all_founders(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    founders = db.query(Founder).order_by(Founder.created_at.desc()).all()
    return {"success": True, "data": [f.to_dict() for f in founders]}


@router.post("/founder")
async def create_founder(
    data: FounderCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    founder = Founder(**data.model_dump())
    db.add(founder)
    db.commit()
    db.refresh(founder)
    return {"success": True, "data": founder.to_dict(), "message": "Founder created successfully"}


@router.put("/founder/{founder_id}")
async def update_founder(
    founder_id: int, data: FounderUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    founder = db.query(Founder).filter(Founder.id == founder_id).first()
    if not founder:
        raise HTTPException(status_code=404, detail="Founder not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(founder, field, value)
    db.commit()
    db.refresh(founder)
    return {"success": True, "data": founder.to_dict(), "message": "Founder updated successfully"}


@router.delete("/founder/{founder_id}")
async def delete_founder(
    founder_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    founder = db.query(Founder).filter(Founder.id == founder_id).first()
    if not founder:
        raise HTTPException(status_code=404, detail="Founder not found")
    db.delete(founder)
    db.commit()
    return {"success": True, "message": "Founder deleted successfully"}


# ─── HOMEPAGE ───────────────────────────────────────────────────────

@router.get("/homepage")
async def get_homepage(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = db.query(HomepageContent).first()
    if not content:
        return {"success": True, "data": None}
    return {"success": True, "data": content.to_dict()}


@router.put("/homepage")
async def update_homepage(
    data: HomepageContentUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = db.query(HomepageContent).first()
    update_data = data.model_dump(exclude_unset=True)
    if content:
        for field, value in update_data.items():
            setattr(content, field, value)
    else:
        content = HomepageContent(**update_data)
        db.add(content)
    db.commit()
    db.refresh(content)
    return {"success": True, "data": content.to_dict(), "message": "Homepage content saved successfully"}


# ─── STORY ──────────────────────────────────────────────────────────

@router.get("/story")
async def get_story(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = db.query(StoryContent).first()
    if not content:
        return {"success": True, "data": None}
    return {"success": True, "data": content.to_dict()}


@router.put("/story")
async def update_story(
    data: StoryContentUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = db.query(StoryContent).first()
    update_data = data.model_dump(exclude_unset=True)
    if content:
        for field, value in update_data.items():
            setattr(content, field, value)
    else:
        content = StoryContent(**update_data)
        db.add(content)
    db.commit()
    db.refresh(content)
    return {"success": True, "data": content.to_dict(), "message": "Story content saved successfully"}


# ─── RECIPES ────────────────────────────────────────────────────────

@router.get("/recipe-content")
async def get_recipe_content(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = db.query(RecipeContent).first()
    if not content:
        return {"success": True, "data": None}
    return {"success": True, "data": content.to_dict()}


@router.put("/recipe-content")
async def update_recipe_content(
    data: RecipeContentUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = db.query(RecipeContent).first()
    update_data = data.model_dump(exclude_unset=True)
    if content:
        for field, value in update_data.items():
            setattr(content, field, value)
    else:
        content = RecipeContent(**update_data)
        db.add(content)
    db.commit()
    db.refresh(content)
    return {"success": True, "data": content.to_dict(), "message": "Recipe section saved successfully"}


@router.get("/recipes")
async def get_recipes(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipes = db.query(Recipe).order_by(Recipe.sort_order).all()
    return {"success": True, "data": [r.to_dict() for r in recipes]}


@router.post("/recipes")
async def create_recipe(
    data: RecipeCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = Recipe(**data.model_dump())
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return {"success": True, "data": recipe.to_dict(), "message": "Recipe created successfully"}


@router.put("/recipes/{recipe_id}")
async def update_recipe(
    recipe_id: int, data: RecipeUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(recipe, field, value)
    db.commit()
    db.refresh(recipe)
    return {"success": True, "data": recipe.to_dict(), "message": "Recipe updated successfully"}


@router.delete("/recipes/{recipe_id}")
async def delete_recipe(
    recipe_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    db.delete(recipe)
    db.commit()
    return {"success": True, "message": "Recipe deleted successfully"}


# ─── TESTIMONIALS ───────────────────────────────────────────────────

@router.get("/testimonials")
async def get_testimonials_admin(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    testimonials = db.query(Testimonial).order_by(Testimonial.sort_order).all()
    return {"success": True, "data": [t.to_dict() for t in testimonials]}


@router.post("/testimonials")
async def create_testimonial(
    data: TestimonialCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    testimonial = Testimonial(**data.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return {"success": True, "data": testimonial.to_dict(), "message": "Testimonial created successfully"}


@router.put("/testimonials/{testimonial_id}")
async def update_testimonial(
    testimonial_id: int, data: TestimonialUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)
    db.commit()
    db.refresh(testimonial)
    return {"success": True, "data": testimonial.to_dict(), "message": "Testimonial updated successfully"}


@router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(testimonial)
    db.commit()
    return {"success": True, "message": "Testimonial deleted successfully"}


# ─── QUALITY FEATURES ──────────────────────────────────────────────

@router.get("/quality-features")
async def get_quality_features_admin(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    features = db.query(QualityFeature).order_by(QualityFeature.sort_order).all()
    return {"success": True, "data": [f.to_dict() for f in features]}


@router.post("/quality-features")
async def create_quality_feature(
    data: QualityFeatureCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    feature = QualityFeature(**data.model_dump())
    db.add(feature)
    db.commit()
    db.refresh(feature)
    return {"success": True, "data": feature.to_dict(), "message": "Quality feature created successfully"}


@router.put("/quality-features/{feature_id}")
async def update_quality_feature(
    feature_id: int, data: QualityFeatureUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    feature = db.query(QualityFeature).filter(QualityFeature.id == feature_id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Quality feature not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(feature, field, value)
    db.commit()
    db.refresh(feature)
    return {"success": True, "data": feature.to_dict(), "message": "Quality feature updated successfully"}


@router.delete("/quality-features/{feature_id}")
async def delete_quality_feature(
    feature_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    feature = db.query(QualityFeature).filter(QualityFeature.id == feature_id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Quality feature not found")
    db.delete(feature)
    db.commit()
    return {"success": True, "message": "Quality feature deleted successfully"}


# ─── TASTING NOTES ─────────────────────────────────────────────────

@router.get("/tasting-notes")
async def get_tasting_notes_admin(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notes = db.query(TastingNote).order_by(TastingNote.sort_order).all()
    return {"success": True, "data": [n.to_dict() for n in notes]}


@router.post("/tasting-notes")
async def create_tasting_note(
    data: TastingNoteCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = TastingNote(**data.model_dump())
    db.add(note)
    db.commit()
    db.refresh(note)
    return {"success": True, "data": note.to_dict(), "message": "Tasting note created successfully"}


@router.put("/tasting-notes/{note_id}")
async def update_tasting_note(
    note_id: int, data: TastingNoteUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(TastingNote).filter(TastingNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Tasting note not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return {"success": True, "data": note.to_dict(), "message": "Tasting note updated successfully"}


@router.delete("/tasting-notes/{note_id}")
async def delete_tasting_note(
    note_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(TastingNote).filter(TastingNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Tasting note not found")
    db.delete(note)
    db.commit()
    return {"success": True, "message": "Tasting note deleted successfully"}


# ─── WHOLESALE ──────────────────────────────────────────────────────

@router.get("/wholesale")
async def get_wholesale_admin(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    config = db.query(WholesaleConfig).first()
    sizes = db.query(WholesaleSize).order_by(WholesaleSize.sort_order).all()
    return {
        "success": True,
        "data": {
            "config": config.to_dict() if config else None,
            "sizes": [s.to_dict() for s in sizes],
        },
    }


@router.put("/wholesale/config")
async def update_wholesale_config(
    data: WholesaleConfigUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    config = db.query(WholesaleConfig).first()
    update_data = data.model_dump(exclude_unset=True)
    if config:
        for field, value in update_data.items():
            setattr(config, field, value)
    else:
        config = WholesaleConfig(**update_data)
        db.add(config)
    db.commit()
    db.refresh(config)
    return {"success": True, "data": config.to_dict(), "message": "Wholesale config saved successfully"}


@router.post("/wholesale/sizes")
async def create_wholesale_size(
    data: WholesaleSizeCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    size = WholesaleSize(**data.model_dump())
    db.add(size)
    db.commit()
    db.refresh(size)
    return {"success": True, "data": size.to_dict(), "message": "Wholesale size created successfully"}


@router.put("/wholesale/sizes/{size_id}")
async def update_wholesale_size(
    size_id: int, data: WholesaleSizeUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    size = db.query(WholesaleSize).filter(WholesaleSize.id == size_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Wholesale size not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(size, field, value)
    db.commit()
    db.refresh(size)
    return {"success": True, "data": size.to_dict(), "message": "Wholesale size updated successfully"}


@router.delete("/wholesale/sizes/{size_id}")
async def delete_wholesale_size(
    size_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    size = db.query(WholesaleSize).filter(WholesaleSize.id == size_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Wholesale size not found")
    db.delete(size)
    db.commit()
    return {"success": True, "message": "Wholesale size deleted successfully"}


# ─── SITE CONFIG ────────────────────────────────────────────────────

@router.get("/site-config")
async def get_site_config_admin(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    config = db.query(SiteConfig).first()
    if not config:
        return {"success": True, "data": None}
    return {"success": True, "data": config.to_dict()}


@router.put("/site-config")
async def update_site_config(
    data: SiteConfigUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    config = db.query(SiteConfig).first()
    update_data = data.model_dump(exclude_unset=True)
    if config:
        for field, value in update_data.items():
            setattr(config, field, value)
    else:
        config = SiteConfig(**update_data)
        db.add(config)
    db.commit()
    db.refresh(config)
    return {"success": True, "data": config.to_dict(), "message": "Site config saved successfully"}


# ─── PRODUCT ACCORDIONS ──────────────────────────────────────────────

@router.get("/product-accordions")
async def get_product_accordions_admin(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sections = db.query(ProductAccordion).order_by(ProductAccordion.sort_order).all()
    return {"success": True, "data": [s.to_dict() for s in sections]}


@router.post("/product-accordions")
async def create_product_accordion(
    data: ProductAccordionCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    section = ProductAccordion(**data.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return {"success": True, "data": section.to_dict(), "message": "Accordion section created successfully"}


@router.put("/product-accordions/{section_id}")
async def update_product_accordion(
    section_id: int, data: ProductAccordionUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    section = db.query(ProductAccordion).filter(ProductAccordion.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Accordion section not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(section, field, value)
    db.commit()
    db.refresh(section)
    return {"success": True, "data": section.to_dict(), "message": "Accordion section updated successfully"}


@router.delete("/product-accordions/{section_id}")
async def delete_product_accordion(
    section_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    section = db.query(ProductAccordion).filter(ProductAccordion.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Accordion section not found")
    db.delete(section)
    db.commit()
    return {"success": True, "message": "Accordion section deleted successfully"}
