# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
See [workflow/taste.md](workflow/taste.md)
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

# assets
- Use the project's existing `@assets/` alias for importing image/static files instead of introducing separate conventions like `public/` — keep consistent with the established import pattern. Confidence: 0.70

# documentation
- For documentation/config sync/audit tasks: only update genuinely outdated or missing content based on actual built state; do not restructure documents, add new sections beyond what's needed, delete accurate content, or add speculative/future features. Confidence: 0.70

# content
- Never fabricate health/quality claims, nutritional data, tasting notes, or specific product facts — use honest placeholder states ("Content coming soon", commented `// PLACEHOLDER - awaiting real content from client`) until real content is provided by the client. Confidence: 0.85

# wouter
- Use wouter's `<Link>` component (with a `to` prop) instead of plain `<a>` tags for internal SPA navigation to prevent full page reloads. Confidence: 0.75

