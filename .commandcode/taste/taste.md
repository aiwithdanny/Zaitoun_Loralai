# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
See [workflow/taste.md](workflow/taste.md)
# architecture
- Follow existing project patterns when adding similar features — reuse the same architectural approach (e.g., single-row config + multi-row CRUD pattern from Founder/Story) rather than inventing new patterns for each new feature. Confidence: 0.75
- Prefer project structure organized by professional standards: clean frontend/backend separation, modular domain-driven organization, consistent naming conventions, scalable hierarchy, and clear purpose for every directory — not flat or ad-hoc layouts. Confidence: 0.70
- When a feature needs both a configuration object (headings, descriptions, settings) and multiple child items (sizes, options, tiers), use a hybrid architectural pattern: a single-row DB table for config + a multi-row DB table for items, served together in a single public API response as `{config, items}`, and managed on one admin page with separate config form and items table sections. Confidence: 0.65

# currency
- Use PKR (Pakistani Rupees) for all pricing, displayed as "Rs. X,XXX" format with comma-separated thousands and no decimals. Confidence: 0.75

# security
- Use distinct JWT role/token_type claims to enforce mutual exclusivity between customer and admin tokens on backend endpoints. Confidence: 0.80
- Flag and ask before making security-relevant changes (password resets, credential changes, access modifications) — do not make silent changes without user approval. Confidence: 0.85

# pip
- Use `python -m pip install` instead of bare `pip install` to ensure packages are installed into the correct virtual environment (prevents packages landing in AppData on Windows). Confidence: 0.80

# error-handling
- Distinguish between network failures (backend unreachable) and backend validation errors (4xx/5xx with JSON body) — parse and show the actual backend error message, only fall back to fallback mechanisms on genuine network errors, not on API validation responses. Confidence: 0.70
- Use distinct, honest messaging in fallback/success paths — don't show the same generic success message when data was saved only locally (e.g. localStorage) vs. when it reached the real backend. Confidence: 0.70
- When converting static content to dynamic, always carry hardcoded fallback values so the UI never breaks if the API is unavailable — every dynamic data source should have a corresponding fallback that preserves the original content. Confidence: 0.80

# assets
- Use the project's existing `@assets/` alias for importing image/static files instead of introducing separate conventions like `public/` — keep consistent with the established import pattern. Confidence: 0.75

# documentation
- For documentation/config sync/audit tasks: only update genuinely outdated or missing content based on actual built state; do not restructure documents, add new sections beyond what's needed, delete accurate content, or add speculative/future features. Confidence: 0.70

# icons
- For dynamic/admin-editable content sections that use icons, store icon component names (e.g., lucide-react icon names like "Leaf", "Clock", "MapPin", "Package") as strings in the database rather than icon URLs, image paths, or other representations. This enables rendering the actual icon component from the stored name. Confidence: 0.65

# content
- Never fabricate health/quality claims, nutritional data, tasting notes, or specific product facts — use honest placeholder states ("Content coming soon", commented `// PLACEHOLDER - awaiting real content from client`) until real content is provided by the client. Confidence: 0.85
- Prefer giving admins full control over content (store as text/HTML for admin editing) rather than leaving sections hardcoded — when given the choice between making only certain items dynamic versus making everything dynamic with rich text support, choose full admin flexibility. Confidence: 0.65
- Homepage sections should follow a professional olive oil brand narrative flow: Hero (first impression) → ProductGrid (what we sell) → Story (heritage) → QualityFeatures (why we're better) → TastingNotes (sensory experience) → WholesaleSection (bulk opportunity) → TestimonialSection (social proof) → About (human connection) → Recipes (usage inspiration). Each section has a distinct narrative role. Confidence: 0.75
- Sections should maintain visual consistency — use the same background scheme (white/light) across all sections on a page unless there is an intentional design rationale for a different background. Avoid having a single section with a contrasting dark background that breaks the visual flow of the rest of the website. Confidence: 0.70

# communication
See [communication/taste.md](communication/taste.md)
# wouter
- Use wouter's `<Link>` component (with a `to` prop) instead of plain `<a>` tags for internal SPA navigation to prevent full page reloads. Confidence: 0.75

