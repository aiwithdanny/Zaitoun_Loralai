"""
Payment processing utilities for WhatsApp webhook
Handles extracting order numbers from messages and processing payments
"""

import re
from sqlalchemy.orm import Session
from datetime import datetime
from src.models import Order
from src.exceptions import OrderNotFound


def extract_order_number(text: str) -> str | None:
    """
    Extract order number from WhatsApp message text
    Order format: ZL-20260626123456-ABCD
    """
    # Look for pattern: ZL-<date>-<hex>
    pattern = r'ZL-\d{14}-[A-F0-9]{4}'
    match = re.search(pattern, text, re.IGNORECASE)
    return match.group(0).upper() if match else None


def extract_confirmation_keywords(text: str) -> bool:
    """
    Check if message contains payment confirmation keywords
    """
    confirmation_keywords = [
        'paid', 'payment confirmed', 'payment done', 'payment received',
        'transfer done', 'amount sent', 'confirmed', 'payment successful',
        'جی ہے', 'paid ha', 'bheji',  # Urdu/Pakistani variations
        'ok', 'yes', 'yes sir', 'done', 'completed'
    ]

    text_lower = text.lower()
    return any(keyword in text_lower for keyword in confirmation_keywords)


def process_payment_webhook(
    message_text: str,
    from_phone: str,
    message_id: str,
    db: Session
) -> dict:
    """
    Process incoming WhatsApp message for payment confirmation

    Returns: {
        'success': bool,
        'order_number': str (if found),
        'action_taken': str,
        'message': str
    }
    """

    # Extract order number from message
    order_number = extract_order_number(message_text)

    if not order_number:
        return {
            'success': False,
            'order_number': None,
            'action_taken': 'no_order_found',
            'message': 'No order number found in message'
        }

    # Find order in database
    order = db.query(Order).filter(
        Order.order_number == order_number,
        Order.customer_phone == from_phone or Order.customer_phone == from_phone.lstrip('+')
    ).first()

    if not order:
        return {
            'success': False,
            'order_number': order_number,
            'action_taken': 'order_not_found',
            'message': f'Order {order_number} not found or phone number mismatch'
        }

    # Check if message contains payment confirmation
    is_confirmed = extract_confirmation_keywords(message_text)

    if not is_confirmed:
        return {
            'success': False,
            'order_number': order_number,
            'action_taken': 'no_confirmation',
            'message': f'Order {order_number} found but no payment confirmation detected in message'
        }

    # Update order with payment confirmation
    try:
        order.payment_status = 'paid'
        order.status = 'confirmed'
        order.whatsapp_message_id = message_id
        order.updated_at = datetime.utcnow()

        db.commit()

        return {
            'success': True,
            'order_number': order_number,
            'action_taken': 'payment_processed',
            'message': f'Order {order_number} payment confirmed and marked as paid'
        }

    except Exception as e:
        db.rollback()
        return {
            'success': False,
            'order_number': order_number,
            'action_taken': 'database_error',
            'message': f'Error processing payment: {str(e)}'
        }
