/**
 * Currency formatting utility
 * Single source of truth for PKR currency display across the app
 * Format: "Rs. X,XXX" with thousands separator, decimals stripped if .00
 */

export function formatPrice(amount: number): string {
  // Handle edge cases
  if (!Number.isFinite(amount)) return 'Rs. 0';

  // Round to 2 decimals
  const rounded = Math.round(amount * 100) / 100;

  // Check if it's a whole number (or effectively .00)
  const isWholeNumber = rounded % 1 === 0;

  if (isWholeNumber) {
    // Format without decimals: 4999 → "Rs. 4,999"
    const formatted = Math.floor(rounded).toLocaleString('en-US');
    return `Rs. ${formatted}`;
  } else {
    // Format with 2 decimals: 24.99 → "Rs. 24.99"
    const formatted = rounded.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `Rs. ${formatted}`;
  }
}
