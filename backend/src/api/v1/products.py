"""
Product API endpoints with JWT protection for admin operations
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from typing import Optional
from datetime import datetime

from src.models.database import get_db
from src.models import Product
from src.config.auth import get_current_user
from src.schemas import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter()

# Allowed sort columns mapped to actual Product model attributes
SORT_COLUMNS = {
    "price": Product.price,
    "name": Product.name,
    "created_at": Product.created_at,
    "sort_order": Product.sort_order,
}


@router.get("/")
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    sort_by: Optional[str] = Query(None, description="Sort column: price, name, created_at, sort_order"),
    sort_dir: Optional[str] = Query("asc", description="Sort direction: asc or desc"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    db: Session = Depends(get_db)
):
    """Get all products with optional filters - Public endpoint"""
    query = db.query(Product).filter(Product.is_active == True)

    if category:
        query = query.filter(Product.category == category)
    if featured is not None:
        query = query.filter(Product.is_featured == featured)
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) |
            (Product.description.ilike(f"%{search}%"))
        )
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Apply sorting
    if sort_by and sort_by in SORT_COLUMNS:
        column = SORT_COLUMNS[sort_by]
        order_func = desc if sort_dir == "desc" else asc
        query = query.order_by(order_func(column), Product.id.asc())
    else:
        query = query.order_by(Product.sort_order.asc(), Product.created_at.desc())

    products = query.all()
    return {
        "success": True,
        "data": [p.to_dict() for p in products],
        "count": len(products)
    }


@router.get("/{slug}")
async def get_product(slug: str, db: Session = Depends(get_db)):
    """Get product by slug - Public endpoint"""
    product = db.query(Product).filter(
        Product.slug == slug,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"success": True, "data": product.to_dict()}


@router.post("/")
async def create_product(
    product_data: ProductCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new product - Admin only (requires JWT token)"""
    from slugify import slugify

    # Generate slug from name
    slug = slugify(product_data.name)

    # Check if slug already exists
    existing = db.query(Product).filter(Product.slug == slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this name already exists"
        )

    product = Product(
        name=product_data.name,
        slug=slug,
        description=product_data.description,
        short_description=product_data.short_description,
        price=product_data.price,
        discount_price=product_data.discount_price,
        stock=product_data.stock,
        category=product_data.category,
        image_url=product_data.image_url,
        is_featured=product_data.is_featured,
        created_at=datetime.utcnow()
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return {
        "success": True,
        "data": product.to_dict(),
        "message": "Product created successfully"
    }


@router.put("/{slug}")
async def update_product(
    slug: str,
    product_data: ProductUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update product - Admin only (requires JWT token)"""
    product = db.query(Product).filter(Product.slug == slug).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update fields if provided
    if product_data.name is not None:
        product.name = product_data.name
        from slugify import slugify as slugify_func
        new_slug = slugify_func(product_data.name)
        existing = db.query(Product).filter(Product.slug == new_slug).first()
        if existing and existing.id != product.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product with this name already exists"
            )
        product.slug = new_slug

    if product_data.description is not None:
        product.description = product_data.description
    if product_data.short_description is not None:
        product.short_description = product_data.short_description
    if product_data.price is not None:
        product.price = product_data.price
    if product_data.stock is not None:
        product.stock = product_data.stock
    if product_data.category is not None:
        product.category = product_data.category
    if product_data.image_url is not None:
        product.image_url = product_data.image_url
    if product_data.discount_price is not None:
        product.discount_price = product_data.discount_price
    if product_data.is_active is not None:
        product.is_active = product_data.is_active
    if product_data.is_featured is not None:
        product.is_featured = product_data.is_featured

    product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(product)

    return {
        "success": True,
        "data": product.to_dict(),
        "message": "Product updated successfully"
    }


@router.delete("/{slug}")
async def delete_product(
    slug: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete product - Admin only (requires JWT token)"""
    product = db.query(Product).filter(Product.slug == slug).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"success": True, "message": "Product deleted successfully"}
