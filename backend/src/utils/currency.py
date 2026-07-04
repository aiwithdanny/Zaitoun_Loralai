"""
Currency formatting utility for backend
Single source of truth for PKR currency display
Format: "Rs. X,XXX" with thousands separator, decimals stripped if .00
"""

def format_price(amount: float) -> str:
    """
    Format amount as PKR currency string.

    Args:
        amount: Numeric amount to format

    Returns:
        Formatted string like "Rs. 4,999" or "Rs. 24.99"
    """
    # Handle edge cases
    if amount is None or not isinstance(amount, (int, float)):
        return "Rs. 0"

    # Round to 2 decimals
    rounded = round(amount, 2)

    # Check if it's a whole number (or effectively .00)
    is_whole_number = rounded == int(rounded)

    if is_whole_number:
        # Format without decimals: 4999 → "Rs. 4,999"
        integer_part = int(rounded)
        formatted = f"{integer_part:,}"
        return f"Rs. {formatted}"
    else:
        # Format with 2 decimals: 24.99 → "Rs. 24.99"
        formatted = f"{rounded:,.2f}"
        return f"Rs. {formatted}"
