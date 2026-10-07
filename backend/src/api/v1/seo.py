"""
SEO endpoints: dynamic sitemap.xml
"""

import os
from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from xml.sax.saxutils import escape

from src.models.database import get_db
from src.models import Product

router = APIRouter()

# Public site URL for sitemap loc entries (env-driven, no hardcode)
SITE_URL = os.getenv("SITE_URL", "https://zaitoun-loralai-1mtz.vercel.app").rstrip("/")

# Static public routes (paths only — no admin, no auth, no API)
STATIC_ROUTES = [
    ("/", "1.0", "daily"),
    ("/founder", "0.7", "monthly"),
    ("/faqs", "0.6", "monthly"),
    ("/track-order", "0.5", "monthly"),
    ("/privacy-policy", "0.3", "yearly"),
    ("/terms-of-service", "0.3", "yearly"),
    ("/refund-policy", "0.3", "yearly"),
]


@router.get("/sitemap.xml", response_class=Response)
async def sitemap(db: Session = Depends(get_db)):
    """Dynamic XML sitemap: static pages + active product groups.

    Always reflects current inventory — no build step, no stale URLs.
    """
    today = datetime.utcnow().strftime("%Y-%m-%d")

    urls = []
    for path, priority, changefreq in STATIC_ROUTES:
        urls.append(
            f"  <url>\n"
            f"    <loc>{escape(SITE_URL + path)}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            f"    <changefreq>{changefreq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            f"  </url>"
        )

    # Active product groups only (frontend routes: /product/:group_id)
    groups = (
        db.query(Product.product_group_id, Product.updated_at)
        .filter(Product.is_active == True)  # noqa: E712
        .filter(Product.product_group_id.isnot(None))
        .distinct(Product.product_group_id)
        .all()
    )
    for group_id, updated_at in groups:
        lastmod = updated_at.strftime("%Y-%m-%d") if updated_at else today
        urls.append(
            f"  <url>\n"
            f"    <loc>{escape(SITE_URL + '/product/' + str(group_id))}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.8</priority>\n"
            f"  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>"
    )
    return Response(content=xml, media_type="application/xml")
